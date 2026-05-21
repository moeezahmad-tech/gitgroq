const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  repoName: {
    type: String,
    required: true,
  },
  commitSha: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  author: {
    type: String,
    required: true,
  },
  aiAnalysis: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Review', reviewSchema);
