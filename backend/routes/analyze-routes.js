const express = require('express');

const { analyze, summarizeFile, getFileContent } = require('../controllers/analyze-controller');

const router = express.Router();

router.post('/', analyze);
router.post('/summarize', summarizeFile);
router.post('/file', getFileContent);

module.exports = router;
