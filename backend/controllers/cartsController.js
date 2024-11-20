import * as cartsService from "../services/cartsService.js";
import { HTTP_ERRORS, sendErrorResponse } from "./errors.js";

export const getCart = async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (req.user.id !== userId) {
        return sendErrorResponse(res, 403, HTTP_ERRORS.FORBIDDEN_CART);
    }

    try {
        const cart = await cartsService.getCart(userId);
        res.json(cart);
    } catch (error) {
        if (error.message === HTTP_ERRORS.NOT_FOUND_CART) {
            return sendErrorResponse(res, 404, HTTP_ERRORS.NOT_FOUND_CART);
        }
        console.error("Error retrieving cart:", error);
        sendErrorResponse(res, 500, HTTP_ERRORS.CART_FAIL);
    }
};

export const addItemsToCart = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { items } = req.body;

    if (req.user.id !== userId) {
        return sendErrorResponse(res, 403, HTTP_ERRORS.FORBIDDEN_CART);
    }

    try {
        const updatedCart = await cartsService.addItemsToCart(userId, items);
        res.json(updatedCart);
    } catch (error) {
        if (error.message === HTTP_ERRORS.INVALID_DATA
            || error.message === HTTP_ERRORS.INVALID_ITEM_ID
            || error.message === HTTP_ERRORS.INVALID_ITEM_QUANTITY
            || error.message === HTTP_ERRORS.INVALID_ITEM_FORMATS) {
            return sendErrorResponse(res, 400, error.message);
        }
        console.error("Error updating cart:", error);
        sendErrorResponse(res, 500, HTTP_ERRORS.FAIL_UPDATE_CART);
    }
};

export const removeItemFromCart = async (req, res) => {
    const userId = parseInt(req.params.userId);
    const { itemId } = req.body;

    if (req.user.id !== userId) {
        return sendErrorResponse(res, 403, HTTP_ERRORS.FORBIDDEN_CART);
    }
    if (!itemId) {
        return sendErrorResponse(res, 400, HTTP_ERRORS.ITEM_ID_REQUIRED);
    }
    if (!Number.isInteger(itemId)) {
        return sendErrorResponse(res, 400, HTTP_ERRORS.INVALID_ITEM_ID_FORMAT);
    }

    try {
        const updatedCart = await cartsService.removeItemFromCart(userId, itemId);
        res.json(updatedCart);
    } catch (error) {
        console.error("Error removing items from cart:", error);
        sendErrorResponse(res, 500, HTTP_ERRORS.FAIL_REMOVE_ITEMS);
    }
};

export const deleteCart = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);

    if (req.user.id !== userId) {
        return sendErrorResponse(res, 403, HTTP_ERRORS.FORBIDDEN_CART);
    }

    try {
        await cartsService.getCart(userId);
        await cartsService.deleteCart(userId);
        res.status(204).send();
    } catch (error) {
        if (error.message === HTTP_ERRORS.NOT_FOUND_CART) {
            return sendErrorResponse(res, 404, error.message);
        }
        console.error("Error deleting cart:", error);
        sendErrorResponse(res, 500, HTTP_ERRORS.FAIL_DELETE_CART);
    }
};

export const checkoutCart = async (req, res) => {
    const cartId = parseInt(req.params.id);

    try {
        const order = await cartsService.checkoutCart(cartId);
        res.status(201).json(order);
    } catch (error) {
        console.error("Error checking out cart:", error);
        sendErrorResponse(res, 500, HTTP_ERRORS.FAIL_CHECKOUT_CART);
    }
};
