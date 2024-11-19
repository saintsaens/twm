import passport from "passport";
import * as authService from "../services/authService.js";

export const login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        req.logIn(user, (err) => {
            if (err) return next(err);
            res.json({ message: 'Login successful', user });
        });
    })(req, res, next);
};

export const signup = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const newUser = await authService.registerUser(username, password);
        req.login(newUser, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to log in after signup' });
            }
            res.status(201).json(newUser);
        });
    } catch (err) {
        if (err.message === 'Username already exists') {
            res.status(409).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
        }
    }
};

export const logout = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ message: 'Logout failed' });
        res.json({ message: 'Logout successful' });
    });
};

export const getUserProfile = (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            id: req.user.id,
            username: req.user.username,
        });
    } else {
        res.status(401).json({ message: 'Not logged in' });
    }
};
