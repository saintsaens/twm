import { beforeAll, vi } from 'vitest';

// Mock the db to prevent real database connections during tests
vi.mock('../db/index.js', () => {
    return {
        query: vi.fn(),
        connect: vi.fn(),
    };
});

// Mock the authentication middleware to prevent real calls to passport
vi.mock('../middleware/authMiddleware.js', () => {
    return {
        isAuthenticated: vi.fn((req, res, next) => {
            req.user = { id: 1, role: 'user' };
            next();
        }),
        isAdmin: vi.fn((req, res, next) => {
            next();
        }),
    };
});     

beforeAll(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
});

afterAll(() => {
    vi.restoreAllMocks();
});

afterEach(() => {
});
