import { test, expect, vi } from 'vitest';
import express from 'express';
import usersRouter from '../routes/users.js';
import { query } from '../db/index.js';
import request from 'supertest';
import bcrypt from 'bcrypt';

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

test('should return all users', async () => {
  vi.mocked(query).mockResolvedValue({ rows: mockUsers });

  const res = await request(app).get('/users');
  expect(res.status).toBe(200);
  expect(res.body).toEqual(mockUsers);
});

test('should return a user by ID', async () => {
  const user = mockUsers[0];
  vi.mocked(query).mockResolvedValue({ rows: [user] });

  const res = await request(app).get(`/users/${user.id}`);
  expect(res.status).toBe(200);
  expect(res.body).toEqual(user);
});

test('should return 404 if user not found by ID', async () => {
  const nonExistentId = 999;
  vi.mocked(query).mockResolvedValue({ rows: [] });

  const res = await request(app).get(`/users/${nonExistentId}`);
  expect(res.status).toBe(404);
  expect(res.text).toBe('User not found');
});

test('should update a user', async () => {
  const updatedUser = {
    username: 'johnsmith',
    password: 'newpassword',
  };
  const user = mockUsers[0];

  // Mock bcrypt.hash to return a simulated hashed password
  const mockedHashedPassword = 'newhashedpassword';
  vi.spyOn(bcrypt, 'hash').mockResolvedValue(mockedHashedPassword);

  // Mock database query to simulate the user update with a new hashed password
  vi.mocked(query).mockResolvedValue({
    rows: [{ ...user, ...updatedUser, hashed_pw: mockedHashedPassword }],
  });

  const res = await request(app).put(`/users/${user.id}`).send(updatedUser);
  expect(res.status).toBe(200);
  expect(res.body.username).toBe(updatedUser.username);
  expect(res.body.hashed_pw).toBe(mockedHashedPassword); // Ensure the new hashed password is returned
});

test('should return 404 if user to update not found', async () => {
  const updatedUser = { username: 'newusername' };
  const nonExistentId = 999;
  vi.mocked(query).mockResolvedValue({ rows: [] });

  const res = await request(app).put(`/users/${nonExistentId}`).send(updatedUser);
  expect(res.status).toBe(404);
  expect(res.text).toBe('User not found');
});

test('should return 400 if no fields to update', async () => {
  const user = mockUsers[0];
  const res = await request(app).put(`/users/${user.id}`).send({});
  expect(res.status).toBe(400);
  expect(res.body.error).toBe('No fields to update');
});

test('should delete a user by ID', async () => {
  const user = mockUsers[0];
  vi.mocked(query).mockResolvedValue({ rows: [user] });

  const res = await request(app).delete(`/users/${user.id}`);
  expect(res.status).toBe(204); // No content on success
});

test('should return 404 if user to delete not found', async () => {
  const nonExistentId = 999;
  vi.mocked(query).mockResolvedValue({ rows: [] });

  const res = await request(app).delete(`/users/${nonExistentId}`);
  expect(res.status).toBe(404);
  expect(res.text).toBe('User not found');
});
