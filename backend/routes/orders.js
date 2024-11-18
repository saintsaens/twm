import Router from 'express-promise-router';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import * as ordersController from '../controllers/ordersController.js';

const router = new Router();

router.use(isAuthenticated);

router.post('/:userId', ordersController.createOrder);
router.get('/', ordersController.getOrdersByUser);
router.get('/:id', ordersController.getOrderDetails);

export default router;
