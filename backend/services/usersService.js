import bcrypt from 'bcrypt';
import * as usersRepository from '../repositories/usersRepository.js';

const saltRounds = 10;

export const getAllUsers = async () => {
  const result = await usersRepository.getAllUsers();
  return result.rows;
};

export const getUserById = async (id, requestingUserId) => {
  if (id !== requestingUserId) {
    throw new Error('FORBIDDEN');
  }

  const result = await usersRepository.getUserById(id);
  if (result.rows.length === 0) {
    throw new Error('NOT_FOUND');
  }
  return result.rows[0];
};

export const updateUser = async (id, { username, password }) => {
  if (!username && !password) {
    throw new Error('NO_FIELDS');
  }

  const hashedPw = password ? await bcrypt.hash(password, saltRounds) : null;
  const result = await usersRepository.updateUser(id, username, hashedPw);

  if (result.rows.length === 0) {
    throw new Error('NOT_FOUND');
  }

  return result.rows[0];
};

export const deleteUser = async (id) => {
  const result = await usersRepository.deleteUser(id);
  if (result.rows.length === 0) {
    throw new Error('NOT_FOUND');
  }
  return result.rows[0];
};
