import Router from "express-promise-router";
import * as db from '../db/index.js';

const router = new Router();

// Create a new seller
router.post('/', async (req, res) => {
  const { name, race, location } = req.body;

  if (!name || !race || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const query = `
      INSERT INTO sellers (name, race, location)
      VALUES ($1, $2::race_type, $3::location_type)
      RETURNING *;`;

    const result = await db.query(query, [name, race, location]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating seller:', error);
    res.status(500).json({ error: 'Failed to create seller' });
  }
});

// Get all sellers
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM sellers;');
    res.send(result.rows);
  } catch (error) {
    console.error('Error retrieving sellers:', error);
    res.status(500).json({ error: 'Failed to retrieve sellers' });
  }
});

// Get a seller by ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await db.query('SELECT * FROM sellers WHERE id = $1;', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('Seller not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving seller:', error);
    res.status(500).json({ error: 'Failed to retrieve seller' });
  }
});

// Update a seller
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, race, location } = req.body;

  if (!name && !race && !location) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  try {
    const query = `
      UPDATE sellers
      SET 
        name = COALESCE($1, name),
        race = COALESCE($2::race_type, race),
        location = COALESCE($3::location_type, location)
      WHERE id = $4
      RETURNING *;`;

    const result = await db.query(query, [
      name || null,
      race || null,
      location || null,
      id
    ]);

    if (result.rowCount === 0) {
      return res.status(404).send('Seller not found');
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating seller:', error);
    res.status(500).json({ error: 'Failed to update seller' });
  }
});

// Delete a seller
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const query = 'DELETE FROM sellers WHERE id = $1 RETURNING *;';
    
    const result = await db.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).send('Seller not found');
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting seller:', error);
    res.status(500).json({ error: 'Failed to delete seller' });
  }
});

export default router;
