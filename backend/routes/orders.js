import Router from "express-promise-router";
import * as db from '../db/index.js';
import { ensureAuthenticated, checkUserId } from "./auth.js";
import passport from "passport";

const router = new Router();

// Create a new order
router.post('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { totalPrice, items, nickname } = req.body;
  const created_at = new Date().toISOString();

  // Check for required fields
  if (!totalPrice || !userId || !nickname || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields or items' });
  }

  try {
    // Check if the user exists
    const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid user_id' });
    }

    // Insert the order
    const orderQuery = `
      INSERT INTO orders (user_id, total_price, created_at, nickname)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const orderResult = await db.query(orderQuery, [userId, totalPrice, created_at, nickname]);

    // Check if the order was successfully inserted
    if (orderResult.rows.length === 0) {
      return res.status(500).json({ error: 'Failed to create order' });
    }

    const orderId = orderResult.rows[0].id;

    // Prepare the insert statement for orders_items
    const orderItemsQuery = `
      INSERT INTO orders_items (order_id, item_id, quantity)
      VALUES ($1, $2, $3);
    `;

    // Insert each item into orders_items
    for (const item of items) {
      const { item_id, quantity } = item;
      await db.query(orderItemsQuery, [orderId, item_id, quantity]);
    }

    // Return the created order along with the items
    res.status(201).json({ order: orderResult.rows[0], items });
  } catch (error) {
    console.error('Error inserting order:', error);
    res.status(500).json({ error: 'Failed to insert order' });
  }
});

// Get all orders by user_id
router.get('/', async (req, res) => {
  const userId = req.query.user;
  try {
    const result = await db.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

router.get('/:id', (req, res, next) => {
  passport.authenticate('session', { session: true })(req, res, next);
}, async (req, res) => {
  const orderId = parseInt(req.params.id);

  // Check if the user is authenticated
  if (!req.user.id) {
    return res.status(401).json({ error: 'Unauthorized: You need to be logged in to access this order' });
  }

  try {
    // Check if the authenticated user is authorized to view the order
    const orderCheck = await db.query(`
      SELECT user_id FROM orders WHERE id = $1
    `, [orderId]);

    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Ensure the user is the owner of the order
    if (orderCheck.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this order' });
    }

    // Fetch the order items
    const result = await db.query(`
      SELECT oi.item_id, oi.quantity, i.name, i.price
      FROM orders_items oi
      JOIN items i ON oi.item_id = i.id
      WHERE oi.order_id = $1
    `, [orderId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order items not found' });
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving order:', error);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});


export default router;
