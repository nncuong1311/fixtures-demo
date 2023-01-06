/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    // setupFiles: [
    //     "<rootDir>/src/tests/dotenv-config.js"
    // ],
    globalSetup: "<rootDir>/tests/config/dotenv-config.js",
    preset: 'ts-jest',
    testEnvironment: 'node',
    // roots: ["<rootDir>/tests"]
};