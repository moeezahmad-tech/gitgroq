const { analyzeUrl, fetchCommitDetails } = require('../services/analyze-service');
const Groq = require('groq-sdk');
const axios = require('axios');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * POST /api/analyze
 * Accepts { url } in the request body and returns full analysis results.
 */
async function analyze(req, res, next) {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        error: { message: 'A valid "url" field is required in the request body.' },
      });
    }

    const result = await analyzeUrl(url);

    return res.status(200).json({
      summary: result.summary,
      commits: result.commits,
      files: result.files,
      fileTree: result.fileTree,
      impact: result.impact,
    });
  } catch (err) {
    if (err.message.includes('Invalid GitHub URL')) {
      return res.status(400).json({ error: { message: err.message } });
    }
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: { message: 'Repository or commit not found on GitHub.' } });
    }
    if (err.response && err.response.status === 403) {
      return res.status(429).json({ error: { message: 'GitHub API rate limit exceeded. Please wait a few minutes and try again.' } });
    }
    next(err);
  }
}

/**
 * POST /api/analyze/summarize
 * Accepts { fileName, content } and returns an AI-generated summary of the file.
 */
async function summarizeFile(req, res, next) {
  try {
    const { fileName, content } = req.body;

    if (!fileName || !content) {
      return res.status(400).json({
        error: { message: 'Both "fileName" and "content" fields are required.' },
      });
    }

    // Truncate content to avoid token limits (keep first 4000 chars)
    const truncatedContent = content.length > 4000 ? content.slice(0, 4000) + '\n... (truncated)' : content;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a code analysis assistant. Provide a brief, clear summary of the given file. Explain what the file does, its main purpose, key functions/classes, and any notable patterns. Keep it concise (2-4 sentences).',
        },
        {
          role: 'user',
          content: `Summarize this file (${fileName}):\n\n${truncatedContent}`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 300,
    });

    const summary = chatCompletion.choices[0]?.message?.content || 'Unable to generate summary.';

    return res.status(200).json({ summary });
  } catch (err) {
    console.error('Summarize error:', err.message || err);
    if (err.status === 401 || err.message?.includes('API key') || err.message?.includes('auth')) {
      return res.status(500).json({ error: { message: 'Groq API key is not configured or invalid.' } });
    }
    if (err.status === 403) {
      return res.status(500).json({ error: { message: 'Groq API returned 403 - check your API key.' } });
    }
    next(err);
  }
}

/**
 * POST /api/analyze/file
 * Accepts { owner, repo, path } and returns the file content.
 */
async function getFileContent(req, res, next) {
  try {
    const { owner, repo, path } = req.body;

    if (!owner || !repo || !path) {
      return res.status(400).json({
        error: { message: '"owner", "repo", and "path" fields are required.' },
      });
    }

    const headers = { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'GitGroq-App' };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );

    return res.status(200).json(response.data);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: { message: 'File not found.' } });
    }
    if (err.response && err.response.status === 403) {
      return res.status(429).json({ error: { message: 'GitHub API rate limit exceeded.' } });
    }
    next(err);
  }
}

/**
 * POST /api/analyze/commit-diff
 * Accepts { owner, repo, sha } and returns the files changed in that commit with patches.
 */
async function getCommitDiff(req, res, next) {
  try {
    const { owner, repo, sha } = req.body;

    if (!owner || !repo || !sha) {
      return res.status(400).json({
        error: { message: '"owner", "repo", and "sha" fields are required.' },
      });
    }

    const commitData = await fetchCommitDetails(owner, repo, sha);
    const files = (commitData.files || []).map((f) => ({
      filename: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
      patch: f.patch || '',
    }));

    return res.status(200).json({ files });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: { message: 'Commit not found.' } });
    }
    if (err.response && err.response.status === 403) {
      return res.status(429).json({ error: { message: 'GitHub API rate limit exceeded.' } });
    }
    next(err);
  }
}

/**
 * POST /api/analyze/summarize-commit
 * Accepts { message, files } where files is an array of { filename, status, additions, deletions }.
 * Returns an AI-generated summary of what the commit does.
 */
async function summarizeCommit(req, res, next) {
  try {
    const { message, files } = req.body;

    if (!message || !files) {
      return res.status(400).json({
        error: { message: 'Both "message" and "files" fields are required.' },
      });
    }

    // Build a concise description of the commit for the AI
    const fileList = files
      .slice(0, 20) // Limit to 20 files to avoid token overflow
      .map((f) => `  ${f.status}: ${f.filename} (+${f.additions} -${f.deletions})`)
      .join('\n');

    const prompt = `Commit message: "${message}"\n\nFiles changed:\n${fileList}${files.length > 20 ? `\n  ... and ${files.length - 20} more files` : ''}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a code review assistant. Given a commit message and list of changed files, provide a brief, clear summary of what this commit does and its impact. Focus on the purpose and key changes. Keep it to 2-3 sentences. Do not use markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 200,
    });

    const summary = chatCompletion.choices[0]?.message?.content || 'Unable to generate summary.';

    return res.status(200).json({ summary });
  } catch (err) {
    console.error('Summarize commit error:', err.message || err);
    if (err.status === 401 || err.message?.includes('API key') || err.message?.includes('auth')) {
      return res.status(500).json({ error: { message: 'Groq API key is not configured or invalid.' } });
    }
    if (err.status === 403) {
      return res.status(500).json({ error: { message: 'Groq API returned 403 - check your API key.' } });
    }
    next(err);
  }
}

module.exports = { analyze, summarizeFile, getFileContent, getCommitDiff, summarizeCommit };
