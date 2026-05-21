const { analyzeUrl } = require('../services/analyze-service');

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
    next(err);
  }
}

module.exports = { analyze };
