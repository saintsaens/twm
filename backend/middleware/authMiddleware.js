import { HTTP_ERRORS, sendErrorResponse } from "../controllers/errors.js";

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return sendErrorResponse(res, 403, HTTP_ERRORS.AUTH.ADMINS_ONLY);
};

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return sendErrorResponse(res, 401, HTTP_ERRORS.AUTH.NOT_LOGGED_IN);
};
