const express = require('express');

const { analyze, summarizeFile, getFileContent, getCommitDiff } = require('../controllers/analyze-controller');

const router = express.Router();

router.post('/', analyze);
router.post('/summarize', summarizeFile);
router.post('/file', getFileContent);
router.post('/commit-diff', getCommitDiff);

module.exports = router;
