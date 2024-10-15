import pg from 'pg'
const { Pool } = pg
 
const pool = new Pool({
  database: 'witcher-ecommerce'
})

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database successfully!');
  });
 
export const query = (text, params, callback) => {
    return pool.query(text, params, callback)
  }