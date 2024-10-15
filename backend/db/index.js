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
  
    // Run a test query
    client.query('SELECT NOW()', (err, result) => {
      release();
      if (err) {
        return console.error('Error executing query', err.stack);
      }
      console.log('Test query result:', result.rows[0]);
    });
  });
 
export const query = (text, params, callback) => {
    return pool.query(text, params, callback)
  }