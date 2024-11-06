export default {
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Optional for additional setup
    moduleFileExtensions: ["js", "json"],
    transform: {
        "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    },
    testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  };
  