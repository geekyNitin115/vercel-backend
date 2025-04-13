import mongoose from 'mongoose';
const { Schema } = mongoose;

const progressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
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

export default mongoose.model('Progress', progressSchema); 