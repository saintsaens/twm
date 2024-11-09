import { test, expect, vi } from 'vitest';
import express from 'express';
import cartsRouter from '../routes/carts.js';
import { query } from '../db/index.js';
import request from 'supertest';
import passport from "passport";

// Mock Express app
const app = express();
app.use(express.json());
app.use('/carts', cartsRouter);

// Tests for getCart
test('should return 401 if user getting the cart is not authenticated', async () => {
    const userId = 1;
    const res = await request(app).get(`/carts/${userId}`);
    expect(res.status).toBe(401);
    expect(res.body.error).toEqual("Unauthorized. You need to be logged in.");
});

test('should return 403 if user getting the cart does not own the cart', async () => {
    const userId = 1;
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 2, role: "user" };
            next();
        };
    });
    const res = await request(app).get(`/carts/${userId}`);
    expect(res.status).toBe(403);
    expect(res.body.error).toEqual("Forbidden. You can only get your own cart.");
});

test('should return 404 if user does not exist', async () => {
    const userId = 999;
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 999, role: "user" };
            next();
        };
    });
    vi.mocked(query).mockResolvedValueOnce({ rows: [] }); // Simulate no user found
    const res = await request(app).get(`/carts/${userId}`);
    expect(res.status).toBe(404);
    expect(res.body.error).toEqual("User not found");
});

test('should return empty array if user has no items in cart', async () => {
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });
    vi.mocked(query).mockResolvedValueOnce({
        rows: [{ id: 1 }]
    });
    // Mock cart items query to return empty result
    vi.mocked(query).mockResolvedValueOnce({ rows: [] });

    const res = await request(app).get('/carts/1');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
    expect(query).toHaveBeenCalledTimes(2);
});

test('should return cart items with quantities for existing user', async () => {
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });
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

    const res = await request(app).get('/carts/1');

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
    expect(query).toHaveBeenCalledTimes(2);
    // Verify the second query (for cart items)
    expect(query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT ui.item_id, ui.quantity, i.name, i.price'),
        [1]
    );
});

test('should return 500 if database query fails', async () => {
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1, role: "user" };
            next();
        };
    });
    // Mock user query to throw an error
    vi.mocked(query).mockRejectedValueOnce(new Error('Database error'));

    const res = await request(app).get('/carts/1');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to retrieve cart' });
});

// Tests for adding items to cart
test('should return 401 if user adding to cart is not authenticated', async () => {
    const userId = 1;
    const items = [{ id: 1, quantity: 2 }];
    const res = await request(app)
        .put(`/carts/add/${userId}`)
        .send({ items });
    
    expect(res.status).toBe(401);
    expect(res.body.error).toEqual("Unauthorized. You need to be logged in.");
});

test('should return 403 if user adding to the cart does not own the cart', async () => {
    const userId = 1;
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 2 };
            next();
        };
    });
    const res = await request(app).put(`/carts/add/${userId}`);
    expect(res.status).toBe(403);
    expect(res.body.error).toEqual("Forbidden. You can only add to your own cart.");
});

test('should return 400 if items is not an array', async () => {
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });

    const res = await request(app)
        .put('/carts/add/1')
        .send({ items: "not an array" });

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual('Invalid data format: items must be an array');
});

test('should return 400 if item data is invalid', async () => {
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });

    const invalidItems = [
        { id: 1 }, // missing quantity
        { quantity: 2 }, // missing id
        { id: "1", quantity: "2" } // wrong types
    ];

    for (const items of [invalidItems]) {
        const res = await request(app)
            .put('/carts/add/1')
            .send({ items: [items[0]] });

        expect(res.status).toBe(400);
        expect(res.body.error).toEqual('Invalid item data: each item must include item_id and quantity as a number');
    }
});

test('should update quantity for existing items in cart', async () => {
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });

    // Mock existing item in cart
    vi.mocked(query).mockResolvedValueOnce({
        rows: [{ user_id: 1, item_id: 1, quantity: 1 }]
    });

    // Mock update query
    vi.mocked(query).mockResolvedValueOnce({ rows: [] });

    // Mock final select query
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
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });

    // Mock no existing item
    vi.mocked(query).mockResolvedValueOnce({ rows: [] });

    // Mock insert query
    vi.mocked(query).mockResolvedValueOnce({ rows: [] });

    // Mock final select query
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
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });

    // Mock existing item check for first item
    vi.mocked(query).mockResolvedValueOnce({ rows: [{ quantity: 1 }] });
    // Mock update for first item
    vi.mocked(query).mockResolvedValueOnce({ rows: [] });
    
    // Mock existing item check for second item
    vi.mocked(query).mockResolvedValueOnce({ rows: [] });
    // Mock insert for second item
    vi.mocked(query).mockResolvedValueOnce({ rows: [] });

    // Mock final select query
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
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });

    vi.mocked(query).mockRejectedValueOnce(new Error('Database error'));

    const res = await request(app)
        .put('/carts/add/1')
        .send({
            items: [{ id: 1, quantity: 1 }]
        });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to update cart');
});

// Tests for removing an item from the cart
test('should return 401 if user removing from cart is not authenticated', async () => {
    const userId = 1;
    const itemId = 1;
    const res = await request(app)
        .put(`/carts/remove/${userId}`)
        .send({ itemId });
    
    expect(res.status).toBe(401);
    expect(res.body.error).toEqual("Unauthorized. You need to be logged in.");
});

test('should return 403 if user tries to remove from another user\'s cart', async () => {
    const userId = 1;
    const itemId = 1;
    
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 2 };
            next();
        };
    });

    const res = await request(app)
        .put(`/carts/remove/${userId}`)
        .send({ itemId });

    expect(res.status).toBe(403);
    expect(res.body.error).toEqual("Forbidden. You can only modify your own cart.");
});

test('should successfully remove an item from cart and return updated cart', async () => {
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });

    // Mock DELETE query
    vi.mocked(query).mockResolvedValueOnce({ rows: [] });

    // Mock SELECT query for updated cart
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

    // Verify DELETE query was called with correct parameters
    expect(query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM users_items'),
        [1, 1]
    );
});

test('should return empty array when removing last item from cart', async () => {
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });

    // Mock DELETE query
    vi.mocked(query).mockResolvedValueOnce({ rows: [] });

    // Mock SELECT query returning empty cart
    vi.mocked(query).mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
        .put('/carts/remove/1')
        .send({ itemId: 1 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
    expect(query).toHaveBeenCalledTimes(2);
});

test('should return 400 if itemId is missing from request', async () => {
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });

    const res = await request(app)
        .put('/carts/remove/1')
        .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual('Item ID is required');
});

test('should return 400 if itemId is invalid', async () => {
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });

    const res = await request(app)
        .put('/carts/remove/1')
        .send({ itemId: 'invalid' });

    expect(res.status).toBe(400);
    expect(res.body.error).toEqual('Invalid item ID format');
});

test('should return 500 if database query fails', async () => {
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });

    // Mock database error
    vi.mocked(query).mockRejectedValueOnce(new Error('Database error'));

    const res = await request(app)
        .put('/carts/remove/1')
        .send({ itemId: 1 });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to remove items from cart');
});

test('should handle non-existent item removal gracefully', async () => {
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });

    // Mock DELETE query for non-existent item
    vi.mocked(query).mockResolvedValueOnce({ rows: [] });

    // Mock SELECT query for current cart state
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

// Tests for deleting a cart
test('should return 401 if user deleting cart is not authenticated', async () => {
    const userId = 1;
    const res = await request(app)
        .delete(`/carts/${userId}`);
    
    expect(res.status).toBe(401);
    expect(res.body.error).toEqual("Unauthorized. You need to be logged in.");
});

test('should return 403 if user tries to delete another user\'s cart', async () => {
    const userId = 1;
    
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 2, role: "user" };
            next();
        };
    });

    const res = await request(app)
        .delete(`/carts/${userId}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toEqual("Forbidden. You can only delete your own cart.");
});

test('should successfully delete a non-empty cart', async () => {
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });

    // Mock DELETE query returning deleted items
    vi.mocked(query).mockResolvedValueOnce({
        rows: [
            { user_id: 1, item_id: 1, quantity: 2 },
            { user_id: 1, item_id: 2, quantity: 1 }
        ]
    });

    const res = await request(app)
        .delete('/carts/1');

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});

    // Verify DELETE query was called with correct parameters
    expect(query).toHaveBeenCalledWith(
        'DELETE FROM users_items WHERE user_id = $1 RETURNING *;',
        [1]
    );
});

test('should return 404 when trying to delete an empty cart', async () => {
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });

    // Mock DELETE query returning no items
    vi.mocked(query).mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
        .delete('/carts/1');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Cart not found or was already empty');
});

test('should return 500 if database query fails', async () => {
    vi.spyOn(passport, 'authenticate').mockImplementation(() => {
        return (req, res, next) => {
            req.user = { id: 1 };
            next();
        };
    });

    // Mock database error
    vi.mocked(query).mockRejectedValueOnce(new Error('Database error'));

    const res = await request(app)
        .delete('/carts/1');

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Failed to delete cart');
});