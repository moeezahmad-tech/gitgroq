const express = require('express');

const { analyze, summarizeFile, getFileContent, getCommitDiff, summarizeCommit } = require('../controllers/analyze-controller');

const router = express.Router();

router.post('/', analyze);
router.post('/summarize', summarizeFile);
router.post('/file', getFileContent);
router.post('/commit-diff', getCommitDiff);
router.post('/summarize-commit', summarizeCommit);

module.exports = router;
