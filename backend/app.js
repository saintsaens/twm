import express from 'express';
import * as db from './db/index.js'
const app = express()
const port = 3001

// Middleware to parse JSON request bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/items', async (req, res, next) => {
  try {
    let query = 'SELECT * FROM items WHERE TRUE'; // TRUE allows for dynamic AND conditions
    const params = [];
    let index = 1;

    if (req.query.type) {
      query += ` AND type::text ILIKE $${index++}`;
      params.push(req.query.type);
    }

    if (req.query.rarity) {
      query += ` AND rarity::text ILIKE $${index++}`;
      params.push(req.query.rarity);
    }

    const result = await db.query(query, params);
    res.send(result.rows);
  } catch (error) {
    next(error);
  }
});

app.get('/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find(item => item.id === id);
  
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
