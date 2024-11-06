import { test, expect, vi } from 'vitest';
import express, { json } from 'express';
import itemsRouter from '../routes/items.js';
import { query } from '../db/index.js';
import request from 'supertest'; // Ensure you import 'supertest'

// Mock Express app
const app = express();
app.use(json());
app.use('/items', itemsRouter);

// Mock data
const mockItems = [
  {
    id: 1,
    name: 'Caerme',
    type: 'Weapon',
    rarity: 'Common',
    price: 6400.00,
    description: '+1-10 Fire damage\n+1-12% Igni Sign intensity\n+1-10% Chance to dismember',
  },
  {
    id: 2,
    name: 'Feline Steel Sword',
    type: 'Weapon',
    rarity: 'Rare',
    price: 1600.00,
    description: null,
  },
];

test('should return all items', async () => {
  vi.mocked(query).mockResolvedValue({ rows: mockItems });

  const res = await request(app).get('/items');
  expect(res.status).toBe(200);
  expect(res.body).toEqual(mockItems);
});

test('should return an item by ID', async () => {
  const item = mockItems[0];
  vi.mocked(query).mockResolvedValue({ rows: [item] });

  const res = await request(app).get(`/${item.id}`);
  expect(res.status).toBe(200);
  expect(res.body).toEqual(item);
});

test('should return 404 if item not found', async () => {
  const nonExistentId = 999;
  vi.mocked(query).mockResolvedValue({ rows: [] });

  const res = await request(app).get(`/items/${nonExistentId}`);
  expect(res.status).toBe(404);
  expect(res.text).toBe('Item not found');
});

test('should create a new item', async () => {
  const newItem = {
    name: 'Wolven Steel Sword',
    type: 'Weapon',
    rarity: 'Legendary',
    price: 1500.00,
  };
  const createdItem = { ...newItem, id: 3 };
  vi.mocked(query).mockResolvedValue({ rows: [createdItem] });

  const res = await request(app).post('/items').send(newItem);
  expect(res.status).toBe(201);
  expect(res.body).toEqual(createdItem);
});

test('should return 400 if required fields are missing', async () => {
  const incompleteItem = { name: 'Potion' }; // Missing other fields
  const res = await request(app).post('/items').send(incompleteItem);
  expect(res.status).toBe(400);
  expect(res.body).toEqual({ error: 'Missing required fields' });
});

test('should update an item by ID', async () => {
  const updatedItem = {
    name: 'Updated Sword',
    type: 'Weapon',
    rarity: 'Epic',
    price: 2000.00,
  };
  const item = mockItems[0];
  vi.mocked(query).mockResolvedValue({ rows: [{ ...item, ...updatedItem }] });

  const res = await request(app).put(`/items/${item.id}`).send(updatedItem);
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ ...item, ...updatedItem });
});

test('should return 404 if item to update not found', async () => {
  const updatedItem = { name: 'Updated Sword' };
  const nonExistentId = 999;
  vi.mocked(query).mockResolvedValue({ rows: [] });

  const res = await request(app).put(`/items/${nonExistentId}`).send(updatedItem);
  expect(res.status).toBe(404);
  expect(res.text).toBe('Item not found');
});

test('should delete an item by ID', async () => {
  const item = mockItems[0];
  vi.mocked(query).mockResolvedValue({ rows: [item] });

  const res = await request(app).delete(`/items/${item.id}`);
  expect(res.status).toBe(204); // No content on success
});

test('should return 404 if item to delete not found', async () => {
  const nonExistentId = 999;
  vi.mocked(query).mockResolvedValue({ rows: [] });

  const res = await request(app).delete(`/items/${nonExistentId}`);
  expect(res.status).toBe(404);
  expect(res.text).toBe('Item not found');
});
