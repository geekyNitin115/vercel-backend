import Progress from '../models/Progress.js';

// Helper function to merge intervals
const mergeIntervals = (intervals) => {
  if (intervals.length <= 1) return intervals;

  intervals.sort((a, b) => a.start - b.start);
  const result = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = result[result.length - 1];

    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end);
    } else {
      result.push(current);
    }
  }

  return result;
};

// Calculate total unique time watched
const calculateProgress = (intervals, duration) => {
  const merged = mergeIntervals(intervals);
  const totalWatched = merged.reduce((acc, interval) => acc + (interval.end - interval.start), 0);
  return Math.min(100, (totalWatched / duration) * 100);
};

export const updateProgress = async (req, res) => {
  try {
    const { videoId, interval, videoDuration } = req.body;
    const userId = req.user._id;

    if (!videoId || !interval || !videoDuration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let progress = await Progress.findOne({ userId, videoId });

    if (!progress) {
      progress = await Progress.create({
        userId,
        videoId,
        videoDuration,
        watchedIntervals: [interval],
        lastPosition: interval.end,
      });
    } else {
      progress.watchedIntervals.push(interval);
      progress.lastPosition = interval.end;
      progress.watchedIntervals = mergeIntervals(progress.watchedIntervals);
      progress.totalProgress = calculateProgress(progress.watchedIntervals, videoDuration);
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProgress = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    const progress = await Progress.findOne({ userId, videoId });

    if (!progress) {
      return res.json({
        watchedIntervals: [],
        totalProgress: 0,
        lastPosition: 0,
      });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 