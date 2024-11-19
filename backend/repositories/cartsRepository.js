import { query } from "../db/index.js";

export const checkUserExists = async (userId) => {
    const result = await query("SELECT id FROM users WHERE id = $1", [userId]);
    return result.rows.length > 0;
};

export const getCartItems = async (userId) => {
    const result = await query(`
    SELECT ui.item_id, ui.quantity, i.name, i.price
    FROM users_items ui
    JOIN items i ON ui.item_id = i.id
    WHERE ui.user_id = $1
  `, [userId]);
    return result.rows;
};

export const checkCartItem = async (userId, itemId) => {
    const result = await query("SELECT 1 FROM users_items WHERE user_id = $1 AND item_id = $2", [userId, itemId]);
    return result.rows.length > 0;
};

export const updateCartItem = async (userId, itemId, quantity) => {
    await query(`
    UPDATE users_items SET quantity = quantity + $1
    WHERE user_id = $2 AND item_id = $3
  `, [quantity, userId, itemId]);
};

export const addCartItem = async (userId, itemId, quantity) => {
    await query(`
    INSERT INTO users_items (user_id, item_id, quantity)
    VALUES ($1, $2, $3)
  `, [userId, itemId, quantity]);
};

export const removeCartItem = async (userId, itemId) => {
    await query("DELETE FROM users_items WHERE user_id = $1 AND item_id = $2", [userId, itemId]);
};

export const clearCart = async (userId) => {
    await query("DELETE FROM users_items WHERE user_id = $1", [userId]);
};

export const createOrder = async (cart) => {
    const { userId, items, total } = cart;
    const result = await query(`
    INSERT INTO orders (user_id, total_price)
    VALUES ($1, $2)
    RETURNING *
  `, [userId, total]);
    return result.rows[0];
};
