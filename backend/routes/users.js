import Router from "express-promise-router";
import * as db from '../db/index.js';
import bcrypt from 'bcrypt';

const router = new Router();
const saltRounds = 10; 

// Create a new user
router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPw = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO users (username, email, hashed_pw)
      VALUES ($1, $2, $3)
      RETURNING *;`;

    const result = await db.query(query, [username, email, hashedPw]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users;');
    res.send(result.rows);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1;', [id]);
    if (result.rowCount === 0) {
      return res.status(404).send('User not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { username, email, password } = req.body;

  if (!username && !email && !password) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  try {
    const hashedPw = password ? await bcrypt.hash(password, saltRounds) : null;

    const query = `
      UPDATE users
      SET 
        username = COALESCE($1, username),
        email = COALESCE($2, email),
        hashed_pw = COALESCE($3, hashed_pw)
      WHERE id = $4
      RETURNING *;`;

    const result = await db.query(query, [
      username || null,
      email || null,
      hashedPw || null,
      id
    ]);

    if (result.rowCount === 0) {
      return res.status(404).send('User not found');
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *;';
    
    const result = await db.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).send('User not found');
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
