import Router from "express-promise-router";
import { ensureAuthenticated, ensureAdmin, checkUserId } from "./auth.js";
import * as db from '../db/index.js'

const router = new Router();

router.get('/', async (req, res, next) => {
  try {
    let query = 'SELECT * FROM items WHERE TRUE'; // TRUE allows for dynamic AND conditions
    const params = [];
    let index = 1;

    if (req.query.type) {
      query += ` AND type::text ILIKE $${index++}`;
      params.push(req.query.type);
    }

    if (req.query.rarity) {
      query += ` AND rarity::text ILIKE $${index++}`;
      params.push(req.query.rarity);
    }

    const result = await db.query(query, params);
    res.send(result.rows);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const query = 'SELECT * FROM items WHERE id = $1';

  try {
    const result = await db.query(query, [id]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Item not found');
    }
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).send('Server error');
  }
});

router.post('/', async (req, res) => {
  try {
    const newItem = req.body;

    if (!newItem.name || !newItem.type || !newItem.rarity || !newItem.price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        INSERT INTO items (name, type, rarity, price)
        VALUES ($1, $2::item_type, $3::rarity_type, $4::money)
        RETURNING *;`;

    const result = await db.query(query, [
      newItem.name,
      newItem.type,
      newItem.rarity,
      newItem.price
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting item:', error);
    res.status(500).json({ error: 'Failed to insert item' });
  }
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, type, rarity, price } = req.body;

  if (!name && !type && !rarity && !price) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  try {
    const query = `
        UPDATE items
        SET 
          name = COALESCE($1, name),
          type = COALESCE($2::item_type, type),
          rarity = COALESCE($3::rarity_type, rarity),
          price = COALESCE($4::money, price)
        WHERE id = $5
        RETURNING *;`;

    const result = await db.query(query, [
      name || null,
      type || null,
      rarity || null,
      price || null,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).send('Item not found');
    }

    res.json(result.rows[0]); // Return the updated item
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const query = 'DELETE FROM items WHERE id = $1 RETURNING *;';

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('Item not found');
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;
