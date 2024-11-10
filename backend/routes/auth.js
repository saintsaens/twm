import Router from "express-promise-router";
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from 'bcrypt';
import * as db from '../db/index.js'

const router = new Router();
const saltRounds = 10;

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const query = 'SELECT * FROM users WHERE username = $1';

  try {
    const { rows } = await db.query(query, [username]);
    const row = rows[0];

    if (!row) {
      return cb(null, false, { message: 'Incorrect username or password.' });
    }

    const isMatch = await bcrypt.compare(password, row.hashed_pw);
    if (!isMatch) {
      return cb(null, false, { message: 'Incorrect username or password.' });
    }

    return cb(null, row);
  } catch (err) {
    console.error('Database query error:', err);
    return cb(err);
  }
}));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.get('/user/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      id: req.user.id,
      username: req.user.username,
    });
  } else {
    res.status(401).json({ message: 'Not logged in' });
  }
});

router.post('/login/password', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Login successful', user });
    });
  })(req, res, next);
});

router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.json({ message: 'Logout successful' });
  });
});

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if user already exists
    const checkUserQuery = 'SELECT id FROM users WHERE username = $1';
    const existingUser = await db.query(checkUserQuery, [username]);

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPw = await bcrypt.hash(password, saltRounds);

    // Insert user into the database
    const insertQuery = `
      INSERT INTO users (username, hashed_pw, role)
      VALUES ($1, $2, $3)
      RETURNING id, username;
    `;

    const result = await db.query(insertQuery, [username, hashedPw, "user"]);

    // Extract the created user
    const user = {
      id: result.rows[0].id,
      username: result.rows[0].username,
    };

    // Log the user in immediately after signup
    req.login(user, (err) => {
      if (err) {
        console.error('Login error after signup:', err);
        return res.status(500).json({ error: 'Failed to log in after signup' });
      }

      return res.status(201).json(user);
    });

  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle potential race condition where unique constraint is violated
    if (error.code === '23505' && error.constraint === 'users_username_key') {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Handle other database errors with more specific messages
    if (error.code === '23502') {
      return res.status(400).json({ error: 'Missing required database fields' });
    }

    if (error.code === '23503') {
      return res.status(400).json({ error: 'Invalid reference in database' });
    }

    // For any other unexpected errors
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
