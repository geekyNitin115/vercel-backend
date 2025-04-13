const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  watchedIntervals: [{
    start: {
      type: Number,
      required: true,
    },
    end: {
      type: Number,
      required: true,
    },
  }],
  totalProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  lastPosition: {
    type: Number,
    default: 0,
  },
  videoDuration: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

// Create a compound index for userId and videoId
progressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema); 