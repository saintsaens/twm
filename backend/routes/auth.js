import Router from "express-promise-router";
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from 'bcrypt';
import * as db from '../db/index.js'

const router = new Router();

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

router.post('/login/password', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

export default router;
