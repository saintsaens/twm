import { test, expect, vi } from 'vitest';
import passport from "passport";
import express from 'express';
import authRouter from '../routes/auth.js';
import bcrypt from "bcrypt";
import * as db from '../db/index.js'

import { query } from '../db/index.js';
import request from 'supertest';

// Mock Express app
const app = express();
app.use(express.json());
app.use('/', authRouter);

// Mock data
const mockUsers = [
    {
        id: 1,
        username: 'johndoe',
        hashed_pw: 'hashedpassword1',
    },
    {
        id: 2,
        username: 'janedoe',
        hashed_pw: 'hashedpassword2',
    },
];

// Tests for signup
test('should return 400 when required fields are missing', async () => {
    const res = await request(app)
        .post('/signup')
        .send({ username: 'testuser' }); // Missing password

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
        error: 'Missing required fields',
    });
});

test('should return 409 when username already exists', async () => {
    const username = 'existinguser';
    const password = 'password123';

    // Mock db.query to return an existing user
    vi.spyOn(db, 'query').mockResolvedValue({
        rows: [{ id: 1 }],
    });

    const res = await request(app)
        .post('/signup')
        .send({ username, password });

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
        error: 'Username already exists',
    });
});

test('should handle database unique constraint violation', async () => {
    const username = 'testuser';
    const password = 'password123';

    // Mock bcrypt.hash
    vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

    // Mock db.query to simulate race condition
    vi.spyOn(db, 'query')
        .mockResolvedValueOnce({ rows: [] }) // No existing user found
        .mockRejectedValueOnce({ // But insertion fails due to race condition
            code: '23505',
            constraint: 'users_username_key'
        });

    const res = await request(app)
        .post('/signup')
        .send({ username, password });

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
        error: 'Username already exists',
    });
});

test('should handle login error after successful user creation', async () => {
    const username = 'testuser';
    const password = 'password123';

    // Mock bcrypt.hash
    vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

    // Mock db.query for successful user creation
    vi.spyOn(db, 'query')
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
            rows: [{ id: 1, username }],
        });

    // Mock req.login to simulate an error
    const mockLogin = vi.fn((user, cb) => cb(new Error('Login failed')));
    app.request.login = mockLogin;

    const res = await request(app)
        .post('/signup')
        .send({ username, password });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
        error: 'Failed to log in after signup',
    });
});

test('should handle other database errors gracefully', async () => {
    const username = 'testuser';
    const password = 'password123';

    // Mock bcrypt.hash
    vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');

    // Mock db.query to simulate database error
    vi.spyOn(db, 'query')
        .mockResolvedValueOnce({ rows: [] })
        .mockRejectedValueOnce({
            code: '23502', // Not null violation
        });

    const res = await request(app)
        .post('/signup')
        .send({ username, password });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
        error: 'Missing required database fields',
    });
});

test('should create a new user and log them in when username is available', async () => {
    const username = 'testuser';
    const password = 'password123';
    const hashedPassword = 'hashedPassword123';

    // Mock bcrypt.hash
    vi.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

    // Mock db.query to first return no existing user, then successful insertion
    const dbQueryMock = vi.spyOn(db, 'query');
    dbQueryMock
        .mockResolvedValueOnce({ rows: [] }) // No existing user found
        .mockResolvedValueOnce({ // Successful user insertion
            rows: [{ id: 1, username }],
        });

    // Mock req.login to call next without errors
    const mockLogin = vi.fn((user, cb) => cb());
    app.request.login = mockLogin;

    const res = await request(app)
        .post('/signup')
        .send({ username, password });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
        id: 1,
        username,
    });
    expect(dbQueryMock).toHaveBeenCalledTimes(2);
    expect(dbQueryMock.mock.calls[0][0]).toContain('SELECT id FROM users'); // Check user existence
    expect(dbQueryMock.mock.calls[1][0]).toContain('INSERT INTO users'); // Insert user
    expect(mockLogin).toHaveBeenCalledWith(
        { id: 1, username },
        expect.any(Function)
    );
});