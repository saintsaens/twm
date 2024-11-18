import { test, expect, vi } from 'vitest';
import passport from "passport";
import express from 'express';
import usersRouter from '../routes/users.js';
import { query } from '../db/index.js';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware.js";

// Mock Express app
const app = express();
app.use(express.json());
app.use('/users', usersRouter);

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

test('should return all users if connected user is admin', async () => {
  vi.mocked(query).mockResolvedValue({ rows: mockUsers });

  const res = await request(app).get('/users');
  
  expect(res.status).toBe(200);
  expect(res.body).toEqual(mockUsers);
});

test('should return a 401 if an unauthenticated user tries to list all users', async () => {
  isAuthenticated.mockImplementationOnce((req, res, next) => {
    return res.status(401).json({ error: 'Unauthorized. You need to be logged in.' });
  });
  vi.mocked(query).mockResolvedValue({ rows: mockUsers });

  const res = await request(app).get('/users');

  expect(res.status).toBe(401);
  expect(res.body.error).toEqual("Unauthorized. You need to be logged in.");
});

test('should return a 403 if a non-admin tries to list all users', async () => {
  isAdmin.mockImplementationOnce((req, res, next) => {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  });
  vi.mocked(query).mockResolvedValue({ rows: mockUsers });

  const res = await request(app).get('/users');

  expect(res.status).toBe(403);
  expect(res.body.error).toEqual("Access denied: Admins only");
});

test('should return user if authenticated user has the same ID', async () => {
  const user = mockUsers[0];
  vi.mocked(query).mockResolvedValue({ rows: [user] });

  const res = await request(app).get(`/users/${user.id}`);

  expect(res.status).toBe(200);
  expect(res.body).toEqual(user);
});

test('should return a 403 if an authenticated user tries to access another user', async () => {
  const userId = 2;
  const user = mockUsers[0];
  vi.mocked(query).mockResolvedValue({ rows: [user] });

  const res = await request(app).get(`/users/${userId}`);

  expect(res.status).toBe(403);
  expect(res.body.error).toEqual("Forbidden. You can only access your own data.");
});

test('should return a 401 if unauthenticated user tries to access any user', async () => {
  isAuthenticated.mockImplementationOnce((req, res, next) => {
    return res.status(401).json({ error: 'Unauthorized. You need to be logged in.' });
  });
  const user = mockUsers[0];
  vi.mocked(query).mockResolvedValue({ rows: [user] });

  const res = await request(app).get(`/users/${user.id}`);

  expect(res.status).toBe(401);
  expect(res.body.error).toEqual("Unauthorized. You need to be logged in.");
});

test('should return 404 if user not found by ID', async () => {
  const nonExistentId = 999;
  vi.mocked(query).mockResolvedValue({ rows: [] });
  isAuthenticated.mockImplementationOnce((req, res, next) => {
    req.user = { id: 999 };
    next();
});

  const res = await request(app).get(`/users/${nonExistentId}`);

  expect(res.status).toBe(404);
  expect(res.text).toBe('User not found');
});

test('should update a user if requester is admin', async () => {
  const updatedUser = {
    username: 'johnsmith',
    password: 'newpassword',
  };
  const user = mockUsers[0];
  const mockedHashedPassword = 'newhashedpassword';
  vi.spyOn(bcrypt, 'hash').mockResolvedValue(mockedHashedPassword);
  vi.mocked(query).mockResolvedValue({
    rows: [{ ...user, ...updatedUser, hashed_pw: mockedHashedPassword }],
  });

  const res = await request(app).put(`/users/${user.id}`).send(updatedUser);

  expect(res.status).toBe(200);
  expect(res.body.username).toBe(updatedUser.username);
  expect(res.body.hashed_pw).toBe(mockedHashedPassword); // Ensure the new hashed password is returned
});

test('should return a 403 if requester is not admin and tries to update user', async () => {
  const updatedUser = {
    username: 'johnsmith',
    password: 'newpassword',
  };
  const user = mockUsers[0];
  isAdmin.mockImplementationOnce((req, res, next) => {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  });
  const mockedHashedPassword = 'newhashedpassword';
  vi.spyOn(bcrypt, 'hash').mockResolvedValue(mockedHashedPassword);
  vi.mocked(query).mockResolvedValue({
    rows: [{ ...user, ...updatedUser, hashed_pw: mockedHashedPassword }],
  });

  const res = await request(app).put(`/users/${user.id}`).send(updatedUser);

  expect(res.status).toBe(403);
  expect(res.body.error).toBe("Access denied: Admins only");
});

test('should return 404 if user to update not found and user is admin', async () => {
  const updatedUser = { username: 'newusername' };
  const nonExistentId = 999;
  vi.mocked(query).mockResolvedValue({ rows: [] });

  const res = await request(app).put(`/users/${nonExistentId}`).send(updatedUser);

  expect(res.status).toBe(404);
  expect(res.text).toBe('User not found');
});

test('should return 400 if no fields to update and user is admin', async () => {
  const user = mockUsers[0];
  
  const res = await request(app).put(`/users/${user.id}`).send({});
  
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('No fields to update');
});

test('should delete a user by ID and user is admin', async () => {
  const user = mockUsers[0];
  vi.mocked(query).mockResolvedValue({ rows: [user] });

  const res = await request(app).delete(`/users/${user.id}`);

  expect(res.status).toBe(204);
});

test('should delete a user by ID and user is not admin', async () => {
  const user = mockUsers[0];
  vi.mocked(query).mockResolvedValue({ rows: [user] });
  isAdmin.mockImplementationOnce((req, res, next) => {
    return res.status(403).json({ error: 'Access denied: Admins only' });
  });

  const res = await request(app).delete(`/users/${user.id}`);
  
  expect(res.status).toBe(403);
  expect(res.body.error).toBe("Access denied: Admins only");
});

test('should return 404 if user to delete not found and user is admin', async () => {
  const nonExistentId = 999;
  vi.mocked(query).mockResolvedValue({ rows: [] });

  const res = await request(app).delete(`/users/${nonExistentId}`);

  expect(res.status).toBe(404);
  expect(res.text).toBe('User not found');
});
