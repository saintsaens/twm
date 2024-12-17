import passport from "passport";
import * as authService from "../services/authService.js";
import { sendErrorResponse, HTTP_ERRORS } from "./errors.js";

export const login = (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) return next(err);
        if (!user) return sendErrorResponse(res, 401, HTTP_ERRORS.AUTH.INVALID_CREDENTIALS);

        req.logIn(user, (err) => {
            if (err) return next(err);
            res.json({ message: 'Login successful' });
        });
    })(req, res, next);
};

export const signup = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return sendErrorResponse(res, 400, HTTP_ERRORS.VALIDATION.MISSING_FIELDS);
    }
    
    try {
        const newUser = await authService.registerUser(username, password);
        req.login(newUser, (err) => {
            if (err) {
                sendErrorResponse(res, 500, "Failed to log in after signup");
            }
            res.status(201).json(newUser);
        });
    } catch (err) {
        if (err.message === HTTP_ERRORS.GENERAL.USERNAME_EXISTS) {
            sendErrorResponse(res, 409, err.message);
        } else {
            sendErrorResponse(res, 500, err.message);
        }
    }
};

export const logout = (req, res) => {
    req.logout((err) => {
        if (err) return sendErrorResponse(res, 500, "Logout failed");
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
        sendErrorResponse(res, 204, HTTP_ERRORS.GENERAL.NO_CONTENT);
    }
};
