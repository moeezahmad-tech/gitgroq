const mongoose = require('mongoose');

const fileBreakdownSchema = new mongoose.Schema({
  name: { type: String, required: true },
  explanation: { type: String, required: true },
}, { _id: false });

const analysisSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    trim: true,
  },
  repoOwner: {
    type: String,
    trim: true,
  },
  repoName: {
    type: String,
    trim: true,
  },
  summary: {
    type: String,
    default: '',
  },
  files: {
    type: [fileBreakdownSchema],
    default: [],
  },
  impact: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Analysis', analysisSchema);
