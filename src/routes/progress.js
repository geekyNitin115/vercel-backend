import express from 'express';
import { getProgress, updateProgress } from '../controllers/progressController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/:videoId')
  .get(getProgress)
  .post(updateProgress);

export default router; 