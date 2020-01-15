const { defaults } = require('jest-config');

module.exports = {
    preset: 'ts-jest/presets/js-with-ts',
    verbose: true,
    globals: {
        'ts-jest': {
            babelConfig: true,
        },
    },
    roots: ['<rootDir>/src'],
    // transform: {
    //     '^.+\\.jsx?$': 'babel-jest', // Adding this line solved the issue
    //     '^.+\\.tsx?$': 'ts-jest',
    // },
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!@equinor/eds-tokens).+(js|jsx)$',
    ],
    moduleDirectories: ['node_modules', '/src'],
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    moduleNameMapper: {
        '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/__mocks__/fileMock.js',
        '\\.(css|less|scss)$': '<rootDir>/__mocks__/fileMock.js',
    },
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    setupFilesAfterEnv: ['./jest.setup.js'],
    collectCoverage: false,
    collectCoverageFrom: [
        '**/src/**/*.{ts,tsx,js,jsx}',
        '!**/src/**/style.{ts,tsx,js,jsx}',
        '!**/node_modules/**',
        '!**/build/**',
    ],
    coverageDirectory: '.coverage',
};
