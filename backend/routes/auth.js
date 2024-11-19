import { Router } from 'express';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/login/password', authController.login);
router.post('/signup', authController.signup);
router.post('/logout', authController.logout);
router.get('/user/profile', authController.getUserProfile);

export default router;