import { query } from '../db/index.js';

export const getAllUsers = async () => {
  return query('SELECT id, username, role FROM users;');
};

export const getUserById = async (id) => {
  return query('SELECT id, username, role FROM users WHERE id = $1;', [id]);
};

export const updateUser = async (id, username, hashedPw) => {
  const queryStr = `
    UPDATE users
    SET 
      username = COALESCE($1, username),
      hashed_pw = COALESCE($2, hashed_pw)
    WHERE id = $3
    RETURNING *;
  `;
  return query(queryStr, [username || null, hashedPw || null, id]);
};

export const deleteUser = async (id) => {
  return query('DELETE FROM users WHERE id = $1 RETURNING *;', [id]);
};
