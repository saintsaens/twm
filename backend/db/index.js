import pg from 'pg'
const { Pool } = pg

import dotenv from "dotenv";
const envFile = process.env.NODE_ENV === 'render' ? '.env.render' : '.env';
dotenv.config({ path: envFile });

const poolConfig = () => ({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'render' ? { rejectUnauthorized: false } : false,
});

const pool = new Pool(poolConfig());

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database successfully!');
});

export const query = (text, params) => {
  return pool.query(text, params)
}
