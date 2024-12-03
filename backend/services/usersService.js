import bcrypt from 'bcrypt';
import * as usersRepository from '../repositories/usersRepository.js';
import { HTTP_ERRORS } from "../controllers/errors.js";

const saltRounds = 10;

export const getAllUsers = async () => {
  const result = await usersRepository.getAllUsers();
  return result.rows;
};

export const getUserById = async (id, requestingUserId) => {
  if (id !== requestingUserId) {
    throw new Error(HTTP_ERRORS.USERS.FORBIDDEN);
  }

  const result = await usersRepository.getUserById(id);
  if (result.rows.length === 0) {
    throw new Error(HTTP_ERRORS.USERS.NOT_FOUND);
  }
  return result.rows[0];
};

export const updateUser = async (id, { username, password }) => {
  if (!username && !password) {
    throw new Error(HTTP_ERRORS.USERS.NO_UPDATE);
  }

  const hashedPw = password ? await bcrypt.hash(password, saltRounds) : null;
  const result = await usersRepository.updateUser(id, username, hashedPw);

  if (result.rows.length === 0) {
    throw new Error(HTTP_ERRORS.USERS.NOT_FOUND);
  }
  
  return result.rows[0];
};

export const deleteUser = async (id) => {
  const result = await usersRepository.deleteUser(id);
  if (result.rows.length === 0) {
    throw new Error(HTTP_ERRORS.USERS.NOT_FOUND);
  }
  return result.rows[0];
};
