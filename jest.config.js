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
        '<rootDir>/node_modules/(?!(@equinor/eds-tokens|@equinor/eds-icons))',
    ],
    moduleDirectories: ['node_modules', '/src'],
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    moduleNameMapper: {
        '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/__mocks__/fileMock.js',
        '\\.(css|less|scss)$': '<rootDir>/__mocks__/fileMock.js',
        "^@procosys/core/(.*)$": ["<rootDir>/src/core/$1"],
        "^@procosys/modules/(.*)$": ["<rootDir>/src/modules/$1"],
        "^@procosys/hooks/(.*)$": ["<rootDir>/src/hooks/$1"],
        "^@procosys/components/(.*)$": ["<rootDir>/src/components/$1"],
        "^@procosys/assets/(.*)$": ["<rootDir>/src/assets/$1"],
        "^@procosys/http/(.*)$": ["<rootDir>/src/http/$1"],
        "^@procosys/util/(.*)$": ["<rootDir>/src/util/$1"],
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
