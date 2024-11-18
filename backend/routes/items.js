import Router from "express-promise-router";
import itemsController from "../controllers/itemsController.js";
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

const router = new Router();

router.get("/", itemsController.getItems);
router.get("/:id", itemsController.getItemById);
router.post("/", isAuthenticated, isAdmin, itemsController.createItem);
router.put("/:id", isAuthenticated, isAdmin, itemsController.updateItem);
router.delete("/:id", isAuthenticated, isAdmin, itemsController.deleteItem);

export default router;
