const request = require('supertest');
const express = require('express');
const itemsRouter = require('../routes/items.js');
const db = require('../db/index.js');

// Mock Express app
const app = express();
app.use(express.json());
app.use('/items', itemsRouter);

describe('GET /items', () => {
  it('should return all items', async () => {
    const itemRow = {
      id: 1,
      name: 'Caerme',
      type: 'Weapon',
      rarity: 'Common',
      price: 6400.00,
      description: '+1-10 Fire damage\n+1-12% Igni Sign intensity\n+1-10% Chance to dismember'
    };
    db.query.mockResolvedValue({
      rows: [
        itemRow,
      ]
    });

    const res = await request(app).get('/items');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([itemRow]);
  });
});
