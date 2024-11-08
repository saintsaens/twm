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

test('should create a new user and log them in', async () => {
    const username = 'testuser';
    const password = 'password123';
    const hashedPassword = 'hashedPassword123';

    // Mock bcrypt.hash
    vi.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

    // Mock db.query to simulate successful user insertion
    vi.spyOn(db, 'query').mockResolvedValue({
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
    expect(mockLogin).toHaveBeenCalledWith(
        { id: 1, username },
        expect.any(Function)
    );
});

test('should return 400 if username or password is missing', async () => {
    // Test for missing username
    let res = await request(app).post('/signup').send({ password: 'password123' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Missing required fields' });

    // Test for missing password
    res = await request(app).post('/signup').send({ username: 'testuser' });
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Missing required fields' });
});

test('should return 500 if database query fails', async () => {
    const username = 'testuser';
    const password = 'password123';

    // Mock bcrypt.hash
    vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword123');

    // Mock db.query to simulate a database error
    vi.spyOn(db, 'query').mockRejectedValue(new Error('Database error'));

    const res = await request(app)
        .post('/signup')
        .send({ username, password });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to create user' });
});