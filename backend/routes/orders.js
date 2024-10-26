import Router from "express-promise-router";
import * as db from '../db/index.js'; 

const router = new Router();

// Create a new order
router.post('/', async (req, res) => {
  const { created_at, user_id, total_price } = req.body;

  // Check for required fields
  if (!created_at || !total_price || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if the user exists
    const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [user_id]);
    if (userCheck.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid user_id' });
    }

    // Insert the order
    const query = `
      INSERT INTO orders (user_id, total_price, created_at)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await db.query(query, [user_id, total_price, created_at]);

    res.status(201).json(result.rows[0]);
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
