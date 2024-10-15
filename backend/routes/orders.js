import express from 'express';
import * as db from '../db/index.js'; // Adjust the path according to your project structure

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  const { date, seller_id, user_id } = req.body;

  // Check for required fields
  if (!date || !seller_id || !user_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if the seller exists
    const sellerCheck = await db.query('SELECT id FROM sellers WHERE id = $1', [seller_id]);
    if (sellerCheck.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid seller_id' });
    }

    // Check if the user exists
    const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [user_id]);
    if (userCheck.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid user_id' });
    }

    // Insert the order
    const query = `
      INSERT INTO orders (date, seller_id, user_id)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const result = await db.query(query, [date, seller_id, user_id]);

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

// Update an order
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { date, seller_id, user_id } = req.body;
  
    try {
      // Check if the seller_id exists if provided
      if (seller_id) {
        const sellerCheck = await db.query('SELECT id FROM sellers WHERE id = $1', [seller_id]);
        if (sellerCheck.rowCount === 0) {
          return res.status(400).json({ error: 'Invalid seller_id' });
        }
      }
  
      // Check if the user_id exists if provided
      if (user_id) {
        const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [user_id]);
        if (userCheck.rowCount === 0) {
          return res.status(400).json({ error: 'Invalid user_id' });
        }
      }
  
      const query = `
        UPDATE orders
        SET 
          date = COALESCE($1, date),
          seller_id = COALESCE($2, seller_id),
          user_id = COALESCE($3, user_id)
        WHERE id = $4
        RETURNING *;
      `;
  
      const result = await db.query(query, [
        date || null,
        seller_id || null,
        user_id || null,
        id
      ]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ error: 'Failed to update order' });
    }
  });
  

// Delete an order
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await db.query('DELETE FROM orders WHERE id = $1 RETURNING *;', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

export default router;
