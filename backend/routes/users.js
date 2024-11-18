import Router from "express-promise-router";
import * as db from '../db/index.js';
import bcrypt from 'bcrypt';
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";

const router = new Router();
const saltRounds = 10; 

// Check authentication for all routes
router.use(isAuthenticated);

// Get all users
router.get('/', isAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, role FROM users;');
    res.send(result.rows);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
  const requestedUserId = parseInt(req.params.id);  // Get the ID from the URL parameter

  // Check if the authenticated user is the same as the requested user
  if (req.user.id !== requestedUserId) {
    return res.status(403).json({ error: 'Forbidden. You can only access your own data.' });
  }

  try {
    const result = await db.query('SELECT id, username, role FROM users WHERE id = $1;', [requestedUserId]);
    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

// Update a user
router.put('/:id', isAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const { username, password } = req.body;

  if (!username && !password) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  try {
    const hashedPw = password ? await bcrypt.hash(password, saltRounds) : null;

    const query = `
      UPDATE users
      SET 
        username = COALESCE($1, username),
        hashed_pw = COALESCE($3, hashed_pw)
      WHERE id = $4
      RETURNING *;`;

    const result = await db.query(query, [
      username || null,
      hashedPw || null,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
router.delete('/:id', isAdmin, async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *;';
    
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
