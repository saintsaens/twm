import express from 'express';
const app = express()
const port = 3001

// Middleware to parse JSON request bodies
app.use(express.json());

// Mock data
let items = [
  { id: 1, name: 'Sword of Power', type: 'weapon', rarity: 'legendary', price: 1000 },
  { id: 2, name: 'Shield of Valor', type: 'armor', rarity: 'epic', price: 800 },
];

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/items', (req, res) => {
  let filteredItems = [...items];
  const { type, rarity } = req.query;
  if (type) {
    filteredItems = filteredItems.filter(item => item.type === type);
  }
  if (rarity) {
    filteredItems = filteredItems.filter(item => item.rarity === rarity);
  }

  res.json(filteredItems);
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
