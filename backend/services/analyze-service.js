const axios = require('axios');
const Analysis = require('../models/Analysis');

/**
 * Get GitHub API headers with auth token.
 */
function getGitHubHeaders() {
  const headers = { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'GitGroq-App' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

/**
 * Parse a GitHub URL to extract owner, repo, and optional commit SHA.
 */
function parseGitHubUrl(url) {
  const repoMatch = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!repoMatch) return null;

  const owner = repoMatch[1];
  const repo = repoMatch[2].replace(/\.git$/, '');

  const commitMatch = url.match(/\/commit\/([a-f0-9]+)/i);
  const sha = commitMatch ? commitMatch[1] : null;

  return { owner, repo, sha };
}

/**
 * Fetch repository info from GitHub API.
 */
async function fetchRepoInfo(owner, repo) {
  const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: getGitHubHeaders(),
  });
  return response.data;
}

/**
 * Fetch all commits (up to 100) from GitHub API.
 */
async function fetchAllCommits(owner, repo) {
  const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`, {
    params: { per_page: 100 },
    headers: getGitHubHeaders(),
  });
  return response.data;
}

/**
 * Fetch the full file tree (recursive) from GitHub API.
 */
async function fetchFileTree(owner, repo, branch = 'main') {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      { headers: getGitHubHeaders() }
    );
    return response.data.tree || [];
  } catch {
    try {
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`,
        { headers: getGitHubHeaders() }
      );
      return response.data.tree || [];
    } catch {
      return [];
    }
  }
}

/**
 * Fetch a specific commit's details.
 */
async function fetchCommitDetails(owner, repo, sha) {
  const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits/${sha}`, {
    headers: getGitHubHeaders(),
  });
  return response.data;
}

/**
 * Analyze a GitHub URL, fetches repo/commit data and generates structured results.
 */
async function analyzeUrl(url) {
  const parsed = parseGitHubUrl(url);
  if (!parsed) {
    throw new Error('Invalid GitHub URL. Please provide a valid GitHub repository or commit URL.');
  }

  const { owner, repo, sha } = parsed;

  let summary = [];
  let commits = [];
  let files = [];
  let fileTree = [];
  let impact = '';

  if (sha) {
    // Analyze a specific commit
    const commit = await fetchCommitDetails(owner, repo, sha);

    summary = [
      { label: 'Repository', value: `${owner}/${repo}` },
      { label: 'Commit', value: sha.slice(0, 7) },
      { label: 'Author', value: commit.commit.author.name },
      { label: 'Date', value: new Date(commit.commit.author.date).toLocaleDateString() },
      { label: 'Message', value: commit.commit.message.split('\n')[0] },
      { label: 'Files Changed', value: `${commit.files.length}` },
      { label: 'Additions', value: `+${commit.stats.additions}` },
      { label: 'Deletions', value: `-${commit.stats.deletions}` },
    ];

    files = (commit.files || []).map((f) => ({
      name: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
    }));

    impact = `This commit changed ${commit.stats.total} lines across ${commit.files.length} file(s).`;
  } else {
    // Analyze the full repo
    const [repoInfo, allCommits, tree] = await Promise.all([
      fetchRepoInfo(owner, repo),
      fetchAllCommits(owner, repo),
      fetchFileTree(owner, repo),
    ]);

    summary = [
      { label: 'Full Name', value: repoInfo.full_name },
      { label: 'Description', value: repoInfo.description || 'No description' },
      { label: 'Primary Language', value: repoInfo.language || 'N/A' },
      { label: 'Stars', value: `${repoInfo.stargazers_count}` },
      { label: 'Forks', value: `${repoInfo.forks_count}` },
      { label: 'Open Issues', value: `${repoInfo.open_issues_count}` },
      { label: 'Default Branch', value: repoInfo.default_branch },
      { label: 'Created', value: new Date(repoInfo.created_at).toLocaleDateString() },
      { label: 'Last Updated', value: new Date(repoInfo.updated_at).toLocaleDateString() },
      { label: 'License', value: repoInfo.license?.name || 'None' },
      { label: 'Total Commits Fetched', value: `${allCommits.length}` },
    ];

    commits = allCommits.map((c) => ({
      sha: c.sha,
      shortSha: c.sha.slice(0, 7),
      message: c.commit.message.split('\n')[0],
      author: c.commit.author.name,
      date: new Date(c.commit.author.date).toLocaleDateString(),
    }));

    fileTree = tree.map((item) => ({
      path: item.path,
      type: item.type, // 'blob' = file, 'tree' = directory
    }));

    impact = `Repository has ${repoInfo.open_issues_count} open issues, ${repoInfo.stargazers_count} stars, and was last updated ${new Date(repoInfo.updated_at).toLocaleDateString()}.`;
  }

  // Save to database
  const analysis = await Analysis.create({
    url,
    repoOwner: owner,
    repoName: repo,
    summary: JSON.stringify(summary),
    files: files.length > 0 ? files.map((f) => ({ name: f.name, explanation: `${f.status} (+${f.additions} -${f.deletions})` })) : [],
    impact,
  });

  return {
    id: analysis._id,
    summary,
    commits,
    files,
    fileTree,
    impact,
  };
}

module.exports = { analyzeUrl, parseGitHubUrl, fetchCommitDetails };
