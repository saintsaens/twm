import * as db from '../db/index.js';

export const insertOrder = async (userId, totalPrice, createdAt, nickname) => {
  const queryStr = `
    INSERT INTO orders (user_id, total_price, created_at, nickname)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  return db.query(queryStr, [userId, totalPrice, createdAt, nickname]);
};

export const insertOrderItems = async (orderId, items) => {
  const queryStr = `
    INSERT INTO orders_items (order_id, item_id, quantity)
    VALUES ($1, $2, $3);
  `;
  for (const item of items) {
    await db.query(queryStr, [orderId, item.item_id, item.quantity]);
  }
};

export const getOrdersByUser = async (userId) => {
  return db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
};

export const getOrderById = async (orderId) => {
  return db.query('SELECT user_id FROM orders WHERE id = $1', [orderId]);
};

export const getOrderItems = async (orderId) => {
  return db.query(`
    SELECT oi.item_id, oi.quantity, i.name, i.price
    FROM orders_items oi
    JOIN items i ON oi.item_id = i.id
    WHERE oi.order_id = $1
  `, [orderId]);
};
