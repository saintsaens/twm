import { test, expect, vi } from 'vitest';
import express from 'express';
import ordersRouter from '../routes/orders.js';
import { query } from '../db/index.js';
import request from 'supertest';

// Mock Express app
const app = express();
app.use(express.json());
app.use('/orders', ordersRouter);

// Mock data
const mockOrders = [
    {
        id: 1,
        user_id: 1,
        total_price: 6400.00,
        created_at: '2024-11-06T12:00:00Z',
        nickname: 'First Order',
    },
    {
        id: 2,
        user_id: 2,
        total_price: 1600.00,
        created_at: '2024-11-05T12:00:00Z',
        nickname: 'Second Order',
    },
];

const mockOrderItems = [
    {
        order_id: 1,
        item_id: 1,
        quantity: 2,
    },
    {
        order_id: 1,
        item_id: 2,
        quantity: 1,
    },
];

test('should create a new order', async () => {
    const newOrder = {
        totalPrice: "6400.00",
        items: [
            { item_id: 1, quantity: 2 },
            { item_id: 2, quantity: 1 }
        ],
        nickname: "ugly-muck"
    };

    const createdOrder = {
        order: {
            id: 1,
            user_id: 1,
            total_price: "6400.00",
            created_at: expect.any(String),
            nickname: "ugly-muck"
        },
        items: [
            { item_id: 1, quantity: 2 },
            { item_id: 2, quantity: 1 }
        ]
    };

    // Mock the user check query to simulate a valid user_id
    vi.mocked(query).mockResolvedValueOnce({ rows: [{ id: 1 }] });

    // Mock the order insertion query
    vi.mocked(query).mockResolvedValueOnce({ rows: [{ id: 1, user_id: 1, total_price: "6400.00", created_at: new Date().toISOString(), nickname: "ugly-muck" }] });

    // Mock the order_items insertions
    vi.mocked(query).mockResolvedValueOnce({ rows: [{ order_id: 1, item_id: 1, quantity: 2 }] });
    vi.mocked(query).mockResolvedValueOnce({ rows: [{ order_id: 1, item_id: 2, quantity: 1 }] });

    const res = await request(app).post('/orders/1').send(newOrder);
    expect(res.status).toBe(201);
    expect(res.body).toEqual(createdOrder);
});


test('should return 400 if required fields are missing', async () => {
    const incompleteOrder = { totalPrice: 6400.00, items: [] };
    const res = await request(app).post('/orders/1').send(incompleteOrder);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Missing required fields or items' });
});

test('should return 400 if user does not exist', async () => {
    const newOrder = {
        totalPrice: 6400.00,
        items: [
            { item_id: 1, quantity: 2 },
        ],
        nickname: 'First Order',
    };
    vi.mocked(query).mockResolvedValueOnce({ rowCount: 0 }); // Simulate no user found

    const res = await request(app).post('/orders/999').send(newOrder);
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid user_id' });
});

test('should return all orders for a user', async () => {
    const userId = 1;
    vi.mocked(query).mockResolvedValueOnce({ rows: mockOrders.filter(order => order.user_id === userId) });

    const res = await request(app).get(`/orders?user=${userId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([mockOrders[0]]);
});

test('should return a specific order by ID', async () => {
    const orderId = 1;
    vi.mocked(query).mockResolvedValueOnce({ rows: mockOrderItems });

    const res = await request(app).get(`/orders/${orderId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockOrderItems);
});

test('should return 404 if order not found by ID', async () => {
    const nonExistentOrderId = 999;
    vi.mocked(query).mockResolvedValueOnce({ rowCount: 0 });

    const res = await request(app).get(`/orders/${nonExistentOrderId}`);
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Order not found' });
});

test('should return 500 if there is a database error', async () => {
    vi.mocked(query).mockRejectedValueOnce(new Error('Database error'));

    const res = await request(app).get('/orders?user=1');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to retrieve orders' });
});
