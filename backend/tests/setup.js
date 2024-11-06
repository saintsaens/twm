import { vi } from 'vitest';

// Mocking the db module to prevent real database connections during tests
vi.mock('../db/index.js', () => {
    return {
        query: vi.fn(),   // Mock query function to prevent real DB queries
        connect: vi.fn(),  // Mock connect function to avoid actual DB connection
    };
});

afterAll(() => {
    vi.restoreAllMocks();  // Restore all mocks after tests
});

afterEach(() => {
    vi.clearAllMocks();  // Clear all mocks after each test
});
