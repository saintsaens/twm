import { test, expect, vi } from 'vitest';
import express from 'express';
import ordersRouter from '../routes/orders.js';
import { query } from '../db/index.js';
import request from 'supertest';
import passport from "passport";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { HTTP_ERRORS, sendErrorResponse } from "../controllers/errors.js";

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

// Tests for createOrder
test('should return 401 if user creating the order is not authenticated', async () => {
    const newOrder = {
        totalPrice: "6400.00",
        items: [
            { item_id: 1, quantity: 2 },
            { item_id: 2, quantity: 1 }
        ],
        nickname: "ugly-muck"
    };
    isAuthenticated.mockImplementationOnce((req, res, next) => {
        return sendErrorResponse(res, 401, HTTP_ERRORS.AUTH.NOT_LOGGED_IN);
    });

    const res = await request(app).post('/orders/1').send(newOrder);

    expect(res.status).toBe(401);
    expect(res.body.error).toEqual(HTTP_ERRORS.AUTH.NOT_LOGGED_IN);
});

test('should return 403 if user is creating order for another user', async () => {
    const userId = 2;
    const newOrder = {
        totalPrice: "6400.00",
        items: [
            { item_id: 1, quantity: 2 },
            { item_id: 2, quantity: 1 }
        ],
        nickname: "ugly-muck"
    };

    const res = await request(app).post(`/orders/${userId}`).send(newOrder);

    expect(res.status).toBe(403);
    expect(res.body.error).toEqual(HTTP_ERRORS.ORDERS.FORBIDDEN);
});

test('should return 400 if required fields are missing when creating order', async () => {
    const incompleteOrder = { totalPrice: 6400.00, items: [] };

    const res = await request(app).post('/orders/1').send(incompleteOrder);

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual(HTTP_ERRORS.VALIDATION.MISSING_FIELDS);
});

test('should return 400 if user does not exist when creating order', async () => {
    const userId = 999;
    const newOrder = {
        totalPrice: 6400.00,
        items: [
            { item_id: 1, quantity: 2 },
        ],
        nickname: 'First Order',
    };
    isAuthenticated.mockImplementationOnce((req, res, next) => {
        req.user = { id: 999 };
        next();
    });
    vi.mocked(query).mockResolvedValueOnce({ rows: [] }); // Simulate no user found

    const res = await request(app).post('/orders/999').send(newOrder);

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual(HTTP_ERRORS.VALIDATION.INVALID_USER_ID);
});

test('should return 201 if user successfully creates order', async () => {
    const newOrder = {
        totalPrice: "6400.00",
        items: [
            { item_id: 1, quantity: 2 },
            { item_id: 2, quantity: 1 }
        ],
        nickname: "ugly-muck"
    };

    // Create a fixed date for testing
    const testDate = new Date().toISOString();

    const mockOrderData = {
        id: 1,
        user_id: 1,
        total_price: "6400.00",
        created_at: testDate,  // Use the fixed date
        nickname: "ugly-muck"
    };

    const expectedResponse = {
        order: {
            id: 1,
            user_id: 1,
            total_price: "6400.00",
            created_at: testDate,  // Use the fixed date
            nickname: "ugly-muck"
        },
        items: [
            { item_id: 1, quantity: 2 },
            { item_id: 2, quantity: 1 }
        ]
    };

    const queryMock = vi.mocked(query);
    queryMock.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    queryMock.mockResolvedValueOnce({ rows: [mockOrderData] });
    queryMock.mockResolvedValueOnce({ rows: [{ order_id: 1, item_id: 1, quantity: 2 }] });
    queryMock.mockResolvedValueOnce({ rows: [{ order_id: 1, item_id: 2, quantity: 1 }] });

    const res = await request(app)
        .post('/orders/1')
        .send(newOrder);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
        order: {
            id: 1,
            user_id: 1,
            total_price: "6400.00",
            nickname: "ugly-muck"
        },
        items: newOrder.items
    });
    expect(new Date(res.body.order.created_at)).toBeInstanceOf(Date);
});

// Tests for getOrders
test('should return 401 if user getting all orders is not authenticated', async () => {
    const userId = 1;
    isAuthenticated.mockImplementationOnce((req, res, next) => {
        return sendErrorResponse(res, 401, HTTP_ERRORS.AUTH.NOT_LOGGED_IN);
    });

    const res = await request(app).get(`/orders?user=${userId}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toEqual(HTTP_ERRORS.AUTH.NOT_LOGGED_IN);
});

test('should return 403 if connected user is not the user for the orders', async () => {
    const userId = 2;

    const res = await request(app).get(`/orders?user=${userId}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toEqual(HTTP_ERRORS.ORDERS.NOT_FOUND);
});

test('should return 400 if user for the orders does not exist', async () => {
    const userId = 999;
    isAuthenticated.mockImplementationOnce((req, res, next) => {
        req.user = { id: 999 };
        next();
    });
    vi.mocked(query).mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get(`/orders?user=${userId}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual(HTTP_ERRORS.USERS.NOT_FOUND);
});

test('should return all orders for an authenticated user', async () => {
    const userId = 1;
    vi.mocked(query).mockResolvedValueOnce({ rows: [1] });
    vi.mocked(query).mockResolvedValueOnce({ rows: mockOrders.filter(order => order.user_id === userId) });

    const res = await request(app).get(`/orders?user=${userId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([mockOrders[0]]);
});

// Tests for getOrder
test('should return 401 if user getting the order is not authenticated', async () => {
    const orderId = 1;
    isAuthenticated.mockImplementationOnce((req, res, next) => {
        return sendErrorResponse(res, 401, HTTP_ERRORS.AUTH.NOT_LOGGED_IN);
    });

    const res = await request(app).get(`/orders/${orderId}`);

    expect(res.status).toBe(401);
    expect(res.body.error).toEqual(HTTP_ERRORS.AUTH.NOT_LOGGED_IN);
});

test('should return 404 if user tries to access an order not from them', async () => {
    const orderId = 1;
    vi.mocked(query).mockResolvedValueOnce({
        rows: [{ user_id: 2 }]
    });

    const res = await request(app).get(`/orders/${orderId}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual(HTTP_ERRORS.ORDERS.NOT_FOUND);
});

test('should return 404 if order not found by ID', async () => {
    const nonExistentOrderId = 999;
    vi.mocked(query).mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get(`/orders/${nonExistentOrderId}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toEqual(HTTP_ERRORS.ORDERS.NOT_FOUND);
});

test('should return a specific order by ID', async () => {
    const orderId = 1;
    vi.mocked(query).mockResolvedValueOnce({
        rows: [{ user_id: 1 }]
    });
    vi.mocked(query).mockResolvedValueOnce({ rows: mockOrderItems });

    const res = await request(app).get(`/orders/${orderId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockOrderItems);
});

test('should return 500 if there is a database error', async () => {
    vi.mocked(query).mockRejectedValueOnce(new Error('Database error'));

    const res = await request(app).get('/orders?user=1');

    expect(res.status).toBe(500);
    expect(res.body.error).toEqual(HTTP_ERRORS.ORDERS.FAIL_RETRIEVE);
});
