import Router from 'express-promise-router';
import { isAdmin, isAuthenticated } from '../middleware/authMiddleware.js';
import * as usersController from '../controllers/usersController.js';

const router = new Router();

router.use(isAuthenticated);

router.get('/', isAdmin, usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.put('/:id', isAdmin, usersController.updateUser);
router.delete('/:id', isAdmin, usersController.deleteUser);

export default router;
