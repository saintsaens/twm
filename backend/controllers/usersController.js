import * as usersService from '../services/usersService.js';
import { HTTP_ERRORS, sendErrorResponse } from "./errors.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    res.json(users);
  } catch (error) {
    sendErrorResponse(res, 500, HTTP_ERRORS.USERS.FAIL_RETRIEVE);
  }
};

export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const user = await usersService.getUserById(id, req.user.id);
    res.json(user);
  } catch (error) {
    if (error.message === HTTP_ERRORS.USERS.FORBIDDEN) {
      return sendErrorResponse(res, 403, HTTP_ERRORS.USERS.FORBIDDEN);
    }
    if (error.message === HTTP_ERRORS.USERS.NOT_FOUND) {
      return sendErrorResponse(res, 404, HTTP_ERRORS.USERS.NOT_FOUND);
    }
    return sendErrorResponse(res, 500, HTTP_ERRORS.USERS.FAIL_RETRIEVE);
  }
};

export const updateUser = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const updatedUser = await usersService.updateUser(id, req.body);
    res.json(updatedUser);
  } catch (error) {
    if (error.message === HTTP_ERRORS.USERS.NO_UPDATE) {
      return sendErrorResponse(res, 400, HTTP_ERRORS.USERS.NO_UPDATE);
    }
    if (error.message === HTTP_ERRORS.USERS.NOT_FOUND) {
      return sendErrorResponse(res, 404, HTTP_ERRORS.USERS.NOT_FOUND);
    }
    return sendErrorResponse(res, 500, HTTP_ERRORS.USERS.FAIL_UPDATE);
  }
};

export const deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await usersService.deleteUser(id);
    res.status(204).send();
  } catch (error) {
    if (error.message === HTTP_ERRORS.USERS.NOT_FOUND) {
      return sendErrorResponse(res, 404, HTTP_ERRORS.USERS.NOT_FOUND);
    }
    return sendErrorResponse(res, 500, HTTP_ERRORS.USERS.FAIL_DELETE);
  }
};
