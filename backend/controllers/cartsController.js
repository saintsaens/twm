import * as cartsService from "../services/cartsService.js";

export const getCart = async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (req.user.id !== userId) {
        return res.status(403).json({ error: "Forbidden. You can only get your own cart." });
    }

    try {
        const cart = await cartsService.getCart(userId);
        res.json(cart);
    } catch (error) {
        if (error.message === 'User not found or cart empty') {
            return res.status(404).json({ error: error.message });
        }
        console.error("Error retrieving cart:", error);
        res.status(500).json({ error: "Failed to retrieve cart" });
    }
};

export const addItemsToCart = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { items } = req.body;

    if (req.user.id !== userId) {
        return res.status(403).json({ error: "Forbidden. You can only add to your own cart." });
    }

    try {
        const updatedCart = await cartsService.addItemsToCart(userId, items);
        res.json(updatedCart);
    } catch (error) {
        if (error.message === "Invalid data format: items must be an array"
            || error.message === "Invalid item: 'id' is required."
            || error.message === "Invalid item: 'quantity' is required."
            || error.message === "Invalid item: 'id' and 'quantity' must be numbers.") {
            return res.status(400).json({ error: error.message });
        }
        console.error("Error updating cart:", error);
        res.status(500).json({ error: "Failed to update cart" });
    }
};

export const removeItemFromCart = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { itemId } = req.body;

    if (req.user.id !== userId) {
        return res.status(403).json({ error: "Forbidden. You can only modify your own cart." });
    }
    if (!itemId) {
        return res.status(400).json({ error: "Item ID is required" });
    }
    if (!Number.isInteger(itemId)) {
        return res.status(400).json({ error: "Invalid item ID format. Must be an integer." });
    }

    try {
        const updatedCart = await cartsService.removeItemFromCart(userId, itemId);
        res.json(updatedCart);
    } catch (error) {
        console.error("Error removing items from cart:", error);
        res.status(500).json({ error: "Failed to remove items from cart" });
    }
};

export const deleteCart = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);

    if (req.user.id !== userId) {
        return res.status(403).json({ error: "Forbidden. You can only delete your own cart." });
    }

    try {
        await cartsService.getCart(userId);
        await cartsService.deleteCart(userId);
        res.status(204).send();
    } catch (error) {
        if (error.message === "User not found or cart empty") {
            return res.status(404).json({ error: error.message });
        }
        console.error("Error deleting cart:", error);
        res.status(500).json({ error: "Failed to delete cart" });
    }
};

export const checkoutCart = async (req, res) => {
    const cartId = parseInt(req.params.id);

    try {
        const order = await cartsService.checkoutCart(cartId);
        res.status(201).json(order);
    } catch (error) {
        console.error("Error checking out cart:", error);
        res.status(500).json({ error: "Failed to checkout cart" });
    }
};
