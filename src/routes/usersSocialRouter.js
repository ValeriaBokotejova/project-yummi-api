import express from 'express';
import authenticate from '../middlewares/authenticate.js';
import * as usersSocialController from '../controllers/usersSocialController.js';

const router = express.Router();

// Public
router.get('/:id/followers', usersSocialController.getFollowers);
router.get('/:id/following', usersSocialController.getFollowing);

// Private
router.post('/:id/follow', authenticate, usersSocialController.follow);
router.delete('/:id/unfollow', authenticate, usersSocialController.unfollow);

export default router;