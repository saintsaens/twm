import { test, expect, vi, describe } from 'vitest';
import express from 'express';
import authRouter from '../routes/auth.js';
import bcrypt from "bcrypt";
import * as authService from "../services/authService.js"
import request from 'supertest';
import { HTTP_ERRORS } from "../controllers/errors.js";

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

describe("signup", () => {
    test('should return 400 when required fields are missing', async () => {
        const missingPasswordRes = await request(app)
            .post('/signup')
            .send({ username: 'testuser' });

        expect(missingPasswordRes.status).toBe(400);
        expect(missingPasswordRes.body).toEqual({
            error: HTTP_ERRORS.VALIDATION.MISSING_FIELDS,
        });

        const missingUsernameRes = await request(app)
            .post('/signup')
            .send({ password: 'password123' });

        expect(missingUsernameRes.status).toBe(400);
        expect(missingUsernameRes.body).toEqual({
            error: HTTP_ERRORS.VALIDATION.MISSING_FIELDS,
        });
    });

    test('should return 409 when username already exists', async () => {
        const username = 'existinguser';
        const password = 'password123';

        vi.spyOn(authService, 'registerUser').mockRejectedValueOnce(new Error(HTTP_ERRORS.GENERAL.USERNAME_EXISTS));

        const res = await request(app)
            .post('/signup')
            .send({ username, password });

        expect(res.status).toBe(409);
        expect(res.body).toEqual({
            error: HTTP_ERRORS.GENERAL.USERNAME_EXISTS,
        });
    });

    test('should create a new user and log them in when username is available', async () => {
        const username = 'testuser';
        const password = 'password123';
        const hashedPassword = 'hashedPassword123';

        vi.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);

        vi.spyOn(authService, 'registerUser')
            .mockResolvedValueOnce({
                id: 1,
                username,
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
    });
});