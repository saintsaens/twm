import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,  // Enable global functions like `test` and `expect`
        environment: 'jsdom',  // Use a browser-like environment for React
        coverage: {
            provider: 'c8',
            exclude: ['src/**/*.css', 'src/**/*.scss'],  // Exclude styles and assets
            reporter: ['text', 'json', 'html'],
        },
        setupFiles: ['./src/tests/setupTests.js'],  // Path to setup file
        include: ['**/tests/**/*.test.js'],  // Include test files
    },
});