import Router from "express-promise-router";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import {
  getCart,
  addItemsToCart,
  removeItemFromCart,
  deleteCart,
  checkoutCart,
} from "../controllers/cartsController.js";

const router = new Router();

router.use(isAuthenticated);

router.get('/:userId', getCart);
router.put('/add/:userId', addItemsToCart);
router.put('/remove/:userId', removeItemFromCart);
router.delete('/:userId', deleteCart);
router.post('/:id/checkout', checkoutCart);

export default router;
