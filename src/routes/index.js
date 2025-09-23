import express from 'express';
import authRouter from './authRouter.js';
import recipeRouter from './recipeRouter.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.use('/auth', authRouter);
router.use('/recipes', recipeRouter);

export default router;
