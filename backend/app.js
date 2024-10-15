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

app.post('/items', async (req, res) => {
  try {
    const newItem = req.body;

    if (!newItem.name || !newItem.type || !newItem.rarity || !newItem.price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
      INSERT INTO items (name, type, rarity, price)
      VALUES ($1, $2::item_type, $3::rarity_type, $4::money)
      RETURNING *;`;

    const result = await db.query(query, [
      newItem.name,
      newItem.type,
      newItem.rarity,
      newItem.price
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting item:', error);
    res.status(500).json({ error: 'Failed to insert item' });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
