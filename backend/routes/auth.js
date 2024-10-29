import Router from "express-promise-router";
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from 'bcrypt';
import * as db from '../db/index.js'

const router = new Router();
const saltRounds = 10;

// Middleware to check if user is authenticated
export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Middleware to verify user ID matches session user ID
export const checkUserId = (req, res, next) => {
  const userId = parseInt(req.params.userId);
  if (req.user.id !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// Middleware to check if user is an admin
export const ensureAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Access denied: Admins only' });
};

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

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

router.get('/user/profile', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      id: req.user.id,
      username: req.user.username,
    });
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

router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Hash the password
    const hashedPw = await bcrypt.hash(password, saltRounds);

    // Insert user into the database
    const query = `
      INSERT INTO users (username, hashed_pw)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await db.query(query, [username, hashedPw]);

    // Extract the created user
    const user = {
      id: result.rows[0].id,
      username: result.rows[0].username,
    };

    // Log the user in immediately after signup
    req.login(user, function(err) {
      if (err) {
        return next(err);
      }

      // Return the newly created user (without password for security)
      return res.status(201).json({
        id: result.rows[0].id,
        username: result.rows[0].username,
      });
    });

    
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

export default router;
