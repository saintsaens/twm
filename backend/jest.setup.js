import { jest } from '@jest/globals';
import db from './db/index.js'; // Import the actual DB module

// Mocking the db module to prevent real database connections during tests
jest.mock('./db/index.js', () => {
    return {
        query: jest.fn(),   // Mock query function to prevent real DB queries
        connect: jest.fn(),  // Mock connect function to avoid actual DB connection
    };
});

beforeAll(async () => {
    console.log = jest.fn();  // Suppress any logs during tests to avoid clutter
});

afterAll(() => {
    jest.restoreAllMocks();
});

beforeEach(() => {
});


afterEach(() => {
    jest.clearAllMocks();
});
