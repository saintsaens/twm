import { test, expect, vi, describe } from 'vitest';
import express from 'express';
import cartsRouter from '../routes/carts.js';
import { query } from '../db/index.js';
import request from 'supertest';
import passport from "passport";
import { isAuthenticated } from '../middleware/authMiddleware.js';
import { HTTP_ERRORS, sendErrorResponse } from "../controllers/errors.js";

// Mock Express app
const app = express();
app.use(express.json());
app.use('/carts', cartsRouter);

describe("getCart", () => {
    test('should return 401 if user getting the cart is not authenticated', async () => {
        const userId = 1;
        isAuthenticated.mockImplementationOnce((req, res, next) => {
            return sendErrorResponse(res, 401, HTTP_ERRORS.AUTH.NOT_LOGGED_IN);
        });

        const res = await request(app).get(`/carts/${userId}`);

        expect(res.status).toBe(401);
        expect(res.body.error).toEqual(HTTP_ERRORS.AUTH.NOT_LOGGED_IN);
    });

    test('should return 403 if user getting the cart does not own the cart', async () => {
        const userId = 2;

        const res = await request(app).get(`/carts/${userId}`);

        expect(res.status).toBe(403);
        expect(res.body.error).toEqual(HTTP_ERRORS.CART.FORBIDDEN);
    });

    test('should return 404 if user does not exist', async () => {
        const userId = 999;
        isAuthenticated.mockImplementationOnce((req, res, next) => {
            req.user = { id: 999, role: "user" };
            next();
        });
        vi.mocked(query).mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get(`/carts/${userId}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toEqual(HTTP_ERRORS.CART.NOT_FOUND);
    });

    test('should return empty array if user has no items in cart', async () => {
        const userId = 1;
        vi.mocked(query).mockResolvedValueOnce({
            rows: [{ id: 1 }]
        });
        vi.mocked(query).mockResolvedValueOnce({ rows: [] });

        const res = await request(app).get(`/carts/${userId}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    test('should return cart items with quantities for existing user', async () => {
        const userId = 1;
        // Mock user query to return a user
        vi.mocked(query).mockResolvedValueOnce({
            rows: [{ id: 1, name: 'Test User' }]
        });
        // Mock cart items query to return items
        vi.mocked(query).mockResolvedValueOnce({
            rows: [
                {
                    item_id: 1,
                    quantity: 2,
                    name: 'Test Item 1',
                    price: "10.00"
                },
                {
                    item_id: 2,
                    quantity: 1,
                    name: 'Test Item 2',
                    price: "20.00"
                }
            ]
        });

        const res = await request(app).get(`/carts/${userId}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            {
                item_id: 1,
                quantity: 2,
                name: 'Test Item 1',
                price: "10.00"
            },
            {
                item_id: 2,
                quantity: 1,
                name: 'Test Item 2',
                price: "20.00"
            }
        ]);
        expect(query).toHaveBeenCalledWith(
            expect.stringContaining('SELECT ui.item_id, ui.quantity, i.name, i.price'),
            [1]
        );
    });

    test('should return 500 if database query fails', async () => {
        vi.mocked(query).mockRejectedValueOnce(new Error(HTTP_ERRORS.GENERAL.DATABASE_ERROR));

        const res = await request(app).get('/carts/1');

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: HTTP_ERRORS.CART.CART_FAIL });
    });
});

describe("addItemsToCart", () => {
    test('should return 401 if user adding to cart is not authenticated', async () => {
        const userId = 1;
        isAuthenticated.mockImplementationOnce((req, res, next) => {
            return res.status(401).json({ error: HTTP_ERRORS.AUTH.NOT_LOGGED_IN });
        });
        const items = [{ id: 1, quantity: 2 }];
        const res = await request(app)
            .put(`/carts/add/${userId}`)
            .send({ items });
    
        expect(res.status).toBe(401);
        expect(res.body.error).toEqual(HTTP_ERRORS.AUTH.NOT_LOGGED_IN);
    });
    
    test('should return 403 if user adding to the cart does not own the cart', async () => {
        const userId = 2;
        const res = await request(app).put(`/carts/add/${userId}`);
        expect(res.status).toBe(403);
        expect(res.body.error).toEqual(HTTP_ERRORS.CART.FORBIDDEN);
    });
    
    test('should return 400 if items is not an array', async () => {
        const userId = 1;
        const res = await request(app)
            .put(`/carts/add/${userId}`)
            .send({ items: "not an array" });
    
        expect(res.status).toBe(400);
        expect(res.body.error).toEqual(HTTP_ERRORS.VALIDATION.INVALID_DATA);
    });
    
    test('should return 400 if item data is invalid', async () => {
        const invalidItems = [
            { id: 1 }, // missing quantity
            { quantity: 2 }, // missing id
            { id: "1", quantity: "2" } // wrong types
        ];
        const errorMessages = [
            HTTP_ERRORS.VALIDATION.INVALID_ITEM_QUANTITY,
            HTTP_ERRORS.VALIDATION.INVALID_ITEM_ID,
            HTTP_ERRORS.VALIDATION.INVALID_ITEM_FORMATS
        ];
    
        for (let i = 0; i < invalidItems.length; i++) {
            const res = await request(app)
                .put('/carts/add/1')
                .send({ items: [invalidItems[i]] });
    
            expect(res.status).toBe(400);
            expect(res.body.error).toEqual(errorMessages[i]);
        }
    });
    
    test('should update quantity for existing items in cart', async () => {
        vi.mocked(query).mockResolvedValueOnce({
            rows: [{ user_id: 1, item_id: 1, quantity: 1 }]
        });
        vi.mocked(query).mockResolvedValueOnce({ rows: [] });
        vi.mocked(query).mockResolvedValueOnce({
            rows: [{
                item_id: 1,
                quantity: 3,
                name: 'Test Item',
                price: "10.00"
            }]
        });
    
        const res = await request(app)
            .put('/carts/add/1')
            .send({
                items: [{ id: 1, quantity: 2 }]
            });
    
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{
            item_id: 1,
            quantity: 3,
            name: 'Test Item',
            price: "10.00"
        }]);
        expect(query).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE users_items'),
            [2, 1, 1]
        );
    });
    
    test('should add new items to cart', async () => {
        vi.mocked(query).mockResolvedValueOnce({ rows: [] });
        vi.mocked(query).mockResolvedValueOnce({ rows: [] });
        vi.mocked(query).mockResolvedValueOnce({
            rows: [{
                item_id: 2,
                quantity: 1,
                name: 'New Item',
                price: "20.00"
            }]
        });
    
        const res = await request(app)
            .put('/carts/add/1')
            .send({
                items: [{ id: 2, quantity: 1 }]
            });
    
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{
            item_id: 2,
            quantity: 1,
            name: 'New Item',
            price: "20.00"
        }]);
        expect(query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO users_items'),
            [1, 2, 1]
        );
    });
    
    test('should handle multiple items in single request', async () => {
        vi.mocked(query).mockResolvedValueOnce({ rows: [{ quantity: 1 }] });
        vi.mocked(query).mockResolvedValueOnce({ rows: [] });
        vi.mocked(query).mockResolvedValueOnce({ rows: [] });
        vi.mocked(query).mockResolvedValueOnce({ rows: [] });
        vi.mocked(query).mockResolvedValueOnce({
            rows: [
                {
                    item_id: 1,
                    quantity: 3,
                    name: 'Test Item 1',
                    price: "10.00"
                },
                {
                    item_id: 2,
                    quantity: 1,
                    name: 'Test Item 2',
                    price: "20.00"
                }
            ]
        });
    
        const res = await request(app)
            .put('/carts/add/1')
            .send({
                items: [
                    { id: 1, quantity: 2 },
                    { id: 2, quantity: 1 }
                ]
            });
    
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
        expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({ item_id: 1, quantity: 3 }),
            expect.objectContaining({ item_id: 2, quantity: 1 })
        ]));
    });
    
    test('should return 500 if database query fails', async () => {
        vi.mocked(query).mockRejectedValueOnce(new Error(HTTP_ERRORS.GENERAL.DATABASE_ERROR));
    
        const res = await request(app)
            .put('/carts/add/1')
            .send({
                items: [{ id: 1, quantity: 1 }]
            });
    
        expect(res.status).toBe(500);
        expect(res.body.error).toBe(HTTP_ERRORS.CART.FAIL_UPDATE);
    });
});

describe("removeItemFromCart", () => {
    test('should return 401 if user removing from cart is not authenticated', async () => {
        const userId = 1;
        const itemId = 1;
        isAuthenticated.mockImplementationOnce((req, res, next) => {
            return res.status(401).json({ error: HTTP_ERRORS.AUTH.NOT_LOGGED_IN });
        });
    
        const res = await request(app)
            .put(`/carts/remove/${userId}`)
            .send({ itemId });
    
        expect(res.status).toBe(401);
        expect(res.body.error).toEqual(HTTP_ERRORS.AUTH.NOT_LOGGED_IN);
    });
    
    test('should return 403 if user tries to remove from another user\'s cart', async () => {
        const userId = 2;
        const itemId = 1;
    
        const res = await request(app)
            .put(`/carts/remove/${userId}`)
            .send({ itemId });
    
        expect(res.status).toBe(403);
        expect(res.body.error).toEqual(HTTP_ERRORS.CART.FORBIDDEN);
    });
    
    test('should successfully remove an item from cart and return updated cart', async () => {
        vi.mocked(query).mockResolvedValueOnce({ rows: [] });
        vi.mocked(query).mockResolvedValueOnce({
            rows: [
                {
                    item_id: 2,
                    quantity: 1,
                    name: 'Remaining Item',
                    price: "20.00"
                }
            ]
        });
    
        const res = await request(app)
            .put('/carts/remove/1')
            .send({ itemId: 1 });
    
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{
            item_id: 2,
            quantity: 1,
            name: 'Remaining Item',
            price: "20.00"
        }]);
        expect(query).toHaveBeenCalledWith(
            expect.stringContaining('DELETE FROM users_items'),
            [1, 1]
        );
    });
    
    test('should return empty array when removing last item from cart', async () => {
        vi.mocked(query).mockResolvedValueOnce({ rows: [] });
        vi.mocked(query).mockResolvedValueOnce({ rows: [] });
    
        const res = await request(app)
            .put('/carts/remove/1')
            .send({ itemId: 1 });
    
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
    
    test('should return 400 if itemId is missing from request', async () => {
        const res = await request(app)
            .put('/carts/remove/1')
            .send({});
    
        expect(res.status).toBe(400);
        expect(res.body.error).toEqual(HTTP_ERRORS.VALIDATION.ITEM_ID_REQUIRED);
    });
    
    test('should return 400 if itemId is invalid', async () => {
        const res = await request(app)
            .put('/carts/remove/1')
            .send({ itemId: 'invalid' });
    
        expect(res.status).toBe(400);
        expect(res.body.error).toEqual(HTTP_ERRORS.VALIDATION.INVALID_ITEM_ID_FORMAT);
    });
    
    test('should return 500 if database query fails', async () => {
        vi.mocked(query).mockRejectedValueOnce(new Error(HTTP_ERRORS.GENERAL.DATABASE_ERROR));
    
        const res = await request(app)
            .put('/carts/remove/1')
            .send({ itemId: 1 });
    
        expect(res.status).toBe(500);
        expect(res.body.error).toBe(HTTP_ERRORS.CART.FAIL_REMOVE_ITEMS);
    });
    
    test('should handle non-existent item removal gracefully', async () => {
        vi.mocked(query).mockResolvedValueOnce({ rows: [] });
        vi.mocked(query).mockResolvedValueOnce({
            rows: [
                {
                    item_id: 2,
                    quantity: 1,
                    name: 'Existing Item',
                    price: "20.00"
                }
            ]
        });
    
        const res = await request(app)
            .put('/carts/remove/1')
            .send({ itemId: 999 });
    
        expect(res.status).toBe(200);
        expect(res.body).toEqual([{
            item_id: 2,
            quantity: 1,
            name: 'Existing Item',
            price: "20.00"
        }]);
    });
});

describe("deleteCart", () => {
    test('should return 401 if user deleting cart is not authenticated', async () => {
        const userId = 1;
        isAuthenticated.mockImplementationOnce((req, res, next) => {
            return res.status(401).json({ error: HTTP_ERRORS.AUTH.NOT_LOGGED_IN });
        });
    
        const res = await request(app)
            .delete(`/carts/${userId}`);
    
        expect(res.status).toBe(401);
        expect(res.body.error).toEqual(HTTP_ERRORS.AUTH.NOT_LOGGED_IN);
    });
    
    test('should return 403 if user tries to delete another user\'s cart', async () => {
        const userId = 2;
    
        const res = await request(app)
            .delete(`/carts/${userId}`);
    
        expect(res.status).toBe(403);
        expect(res.body.error).toEqual(HTTP_ERRORS.CART.FORBIDDEN);
    });
    
    test('should successfully delete a non-empty cart', async () => {
        // Mock 2 calls: one get cart items, and one to delete cart.
        vi.mocked(query).mockResolvedValue({
            rows: [
                { user_id: 1, item_id: 1, quantity: 2 },
                { user_id: 1, item_id: 2, quantity: 1 }
            ]
        });
    
        const res = await request(app)
            .delete('/carts/1');
    
        expect(res.status).toBe(204);
        expect(res.body).toEqual({});
    });
        
    test('should return 500 if database query fails', async () => {
        vi.mocked(query).mockRejectedValueOnce(new Error(HTTP_ERRORS.GENERAL.DATABASE_ERROR));
    
        const res = await request(app)
            .delete('/carts/1');
    
        expect(res.status).toBe(500);
        expect(res.body.error).toBe(HTTP_ERRORS.CART.FAIL_DELETE);
    });
});