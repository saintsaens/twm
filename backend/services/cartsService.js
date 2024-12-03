import { HTTP_ERRORS } from "../controllers/errors.js";
import * as cartsRepository from "../repositories/cartsRepository.js";

export const getCart = async (userId) => {
    const userExists = await cartsRepository.checkUserExists(userId);
    if (!userExists) {
        throw new Error(HTTP_ERRORS.CART.NOT_FOUND);
    }
    return await cartsRepository.getCartItems(userId);
};

export const addItemsToCart = async (userId, items) => {
    if (!Array.isArray(items)) {
        throw new TypeError(HTTP_ERRORS.VALIDATION.INVALID_DATA);
    }

    for (const item of items) {
        const { id: itemId, quantity } = item;

        if (itemId === undefined) {
            throw new Error(HTTP_ERRORS.VALIDATION.INVALID_ITEM_ID);
        }
        if (quantity === undefined) {
            throw new Error(HTTP_ERRORS.VALIDATION.INVALID_ITEM_QUANTITY);
        }
        if (typeof itemId !== "number" || typeof quantity !== "number") {
            throw new Error(HTTP_ERRORS.VALIDATION.INVALID_ITEM_FORMATS);
        }

        const itemExists = await cartsRepository.checkCartItem(userId, itemId);
        if (itemExists) {
            await cartsRepository.updateCartItem(userId, itemId, quantity);
        } else {
            await cartsRepository.addCartItem(userId, itemId, quantity);
        }
    }

    return await cartsRepository.getCartItems(userId);
};

export const removeItemFromCart = async (userId, itemId) => {
    await cartsRepository.removeCartItem(userId, itemId);
    return await cartsRepository.getCartItems(userId);
};

export const deleteCart = async (userId) => {
    await cartsRepository.clearCart(userId);
};

export const checkoutCart = async (cartId) => {
    const cart = await cartsRepository.getCart(cartId);
    if (!cart) {
        throw new Error(HTTP_ERRORS.CART.NOT_FOUND);
    }
    const order = await cartsRepository.createOrder(cart);
    await cartsRepository.clearCart(cartId);
    return order;
};
