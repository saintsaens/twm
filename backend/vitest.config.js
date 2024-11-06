import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,  // Enable global test functions like `test` and `expect`
        environment: 'node',  // Run tests in a Node.js environment
        coverage: {
            provider: 'c8',  // Specify coverage tool (e.g., 'c8')
            reporter: ['text', 'json', 'html'],  // Choose coverage formats
        },
        setupFiles: ['./tests/setup.js'],  // Setup file
        include: ['**/tests/**/*.test.js'],  // Glob pattern to include tests
    },
});
