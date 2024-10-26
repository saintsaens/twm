import Router from "express-promise-router";
import * as db from '../db/index.js'; 

const router = new Router();

// Create a new order
router.post('/', async (req, res) => {
  const { user_id, total_price, items } = req.body;
  const created_at = new Date().toISOString();

  // Check for required fields
  if (!total_price || !user_id || !items || items.length === 0) {
    return res.status(400).json({ error: 'Missing required fields or items' });
  }

  try {
    // Check if the user exists
    const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [user_id]);
    if (userCheck.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid user_id' });
    }

    // Insert the order
    const orderQuery = `
      INSERT INTO orders (user_id, total_price, created_at)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const orderResult = await db.query(orderQuery, [user_id, total_price, created_at]);

    const orderId = orderResult.rows[0].id; // Get the newly created order ID

    // Prepare the insert statement for orders_items
    const orderItemsQuery = `
      INSERT INTO orders_items (order_id, item_id, quantity)
      VALUES ($1, $2, $3);
    `;

    // Insert each item into orders_items
    for (const item of items) {
      const { item_id, quantity } = item; // Destructure item_id and quantity
      await db.query(orderItemsQuery, [orderId, item_id, quantity]);
    }

    // Return the created order along with the items
    res.status(201).json({ order: orderResult.rows[0], items });
  } catch (error) {
    console.error('Error inserting order:', error);
    res.status(500).json({ error: 'Failed to insert order' });
  }
});


// Get all orders
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM orders');
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving orders:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving order:', error);
    res.status(500).json({ error: 'Failed to retrieve order' });
  }
});

export default router;
