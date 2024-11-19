import db from '../db/index.js';

export const findUserByUsername = async (username) => {
    const query = 'SELECT * FROM users WHERE username = $1';
    const { rows } = await db.query(query, [username]);
    return rows[0];
};

export const createUser = async (username, hashedPw, role = "user") => {
    const query = `
        INSERT INTO users (username, hashed_pw, role)
        VALUES ($1, $2, $3)
        RETURNING id, username;
    `;
    const { rows } = await db.query(query, [username, hashedPw, role]);
    return rows[0];
};
