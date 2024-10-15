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

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});
