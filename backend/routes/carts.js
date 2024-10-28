import Router from "express-promise-router";
import * as db from '../db/index.js';

const router = new Router();

// Get the cart of a user
router.get('/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    // Check if user exists.
    const resultUser = await db.query('SELECT * FROM users WHERE id = $1;', [userId]);
    if (resultUser.rowCount === 0) {
      return res.status(404).send('User not found');
    }

    // Query to get items associated with the user from users_items
    const result = await db.query(`
      SELECT ui.item_id, ui.quantity, i.name, i.price
      FROM users_items ui
      JOIN items i ON ui.item_id = i.id
      WHERE ui.user_id = $1
    `, [userId]);

    // Return the items in the cart along with their quantities
    res.json(result.rows);
  } catch (error) {
    console.error('Error retrieving cart:', error);
    res.status(500).json({ error: 'Failed to retrieve cart' });
  }
});

// Add items to the cart
router.put('/add/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId);
  const { items = [] } = req.body; // Default to an empty array if items is undefined

  // Validate that items is an array
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid data format: items must be an array' });
  }

  try {
    for (const item of items) {
      const { id: item_id, quantity } = item;
      if (!item_id || typeof quantity !== 'number') {
        return res.status(400).json({ error: 'Invalid item data: each item must include item_id and quantity as a number' });
      }

      const itemExistsResult = await db.query(`
            SELECT * FROM users_items WHERE user_id = $1 AND item_id = $2;
            `, [userId, item_id]);

      if (itemExistsResult.rowCount > 0) {
        await db.query(`
                UPDATE users_items
                SET quantity = quantity + $1
                WHERE user_id = $2 AND item_id = $3;
                `, [quantity, userId, item_id]);
      } else {
        await db.query(`
                  INSERT INTO users_items (user_id, item_id, quantity)
                  VALUES ($1, $2, $3);
                  `, [userId, item_id, quantity]);
      }
    }

    const updatedItemsResult = await db.query(`
      SELECT ui.item_id, ui.quantity, i.name, i.price
      FROM users_items ui
      JOIN items i ON ui.item_id = i.id
      WHERE ui.user_id = $1
    `, [userId]);
    res.json(updatedItemsResult.rows);

  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Delete a cart
router.delete('/:userId', async (req, res) => {
  const id = parseInt(req.params.userId);

  try {
    const result = await db.query('DELETE FROM users_items WHERE user_id = $1 RETURNING *;', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cart not found or was already empty' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting cart:', error);
    res.status(500).json({ error: 'Failed to delete cart' });
  }
});

// Checkout
router.post("/:id/checkout", async (req, res) => {
  const cart_id = parseInt(req.params.id);

  // Validate the cart to ensure that it exists.
  const cartResult = await db.query('SELECT * FROM carts WHERE id = $1', [cart_id]);
  if (cartResult.rowCount === 0) {
    return res.status(400).json({ error: 'Invalid cart_id' });
  }

  // Extract the user_id from the cart
  const cart = cartResult.rows[0];
  const { user_id } = cart;

  try {
    // Calculate total_price by summing item prices in the cart
    const priceResult = await db.query(`
      SELECT SUM(items.price * carts_items.quantity) AS total_price
      FROM carts_items
      JOIN items ON carts_items.item_id = items.id
      WHERE carts_items.cart_id = $1;
    `, [cart_id]);

    const total_price = priceResult.rows[0].total_price;

    if (!total_price) {
      return res.status(400).json({ error: 'Cart is empty or total price is zero' });
    }

    // Now create the order with the calculated total_price
    const orderDetails = {
      user_id: user_id,
      total_price: total_price,
      created_at: new Date().toISOString()
    };

    // Insert the new order into the orders table
    const orderQuery = `
      INSERT INTO orders (user_id, total_price, created_at)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const orderResult = await db.query(orderQuery, [
      orderDetails.user_id,
      orderDetails.total_price,
      orderDetails.created_at
    ]);

    const order_id = orderResult.rows[0].id;
    // Transfer items from carts_items to orders_items
    await db.query(`
      INSERT INTO orders_items (order_id, item_id, quantity)
      SELECT $1, item_id, quantity
      FROM carts_items
      WHERE cart_id = $2;
    `, [order_id, cart_id]);

    // Delete items from carts_items
    await db.query(`
    DELETE FROM carts_items
    WHERE cart_id = $1;
  `, [cart_id]);

    res.status(201).json(orderResult.rows[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});


export default router;
