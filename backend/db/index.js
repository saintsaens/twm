import pg from 'pg'
const { Pool } = pg

import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  database: process.env.DATABASE
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database successfully!');
});

export const query = (text, params) => {
  return pool.query(text, params)
}
