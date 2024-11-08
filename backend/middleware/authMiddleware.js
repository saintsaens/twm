import passport from 'passport';

export const isAdmin = (req, res, next) => {
    console.log(req.user);
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'Access denied: Admins only' });
};

export const isAuthenticated = (req, res, next) => {
  passport.authenticate('session', { session: true })(req, res, () => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized. You need to be logged in.' });
    }
    next();
  });
};
