import { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    preset: 'ts-jest',
    testEnvironment: "jsdom",
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        // '^.+\\.[tj]sx?$' to process ts,js,tsx,jsx with `ts-jest`
        // '^.+\\.m?[tj]sx?$' to process ts,js,tsx,jsx,mts,mjs,mtsx,mjsx with `ts-jest`
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: true,
            },
        ],
    },
    verbose: true,
    roots: ['<rootDir>/src'],
    transformIgnorePatterns: [
        '<rootDir>/node_modules/(?!(@equinor/eds-tokens|@equinor/eds-icons))',
    ],
    moduleDirectories: ['node_modules', '/src'],
    moduleNameMapper: {
        '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/__mocks__/fileMock.js',
        '\\.(css|less|scss)$': '<rootDir>/__mocks__/fileMock.js',
        '(.*)/settings.json$': '<rootDir>/__mocks__/settings.mock.json',
        "^@procosys/core/(.*)$": ["<rootDir>/src/core/$1"],
        "^@procosys/modules/(.*)$": ["<rootDir>/src/modules/$1"],
        "^@procosys/hooks/(.*)$": ["<rootDir>/src/hooks/$1"],
        "^@procosys/components/(.*)$": ["<rootDir>/src/components/$1"],
        "^@procosys/assets/(.*)$": ["<rootDir>/src/assets/$1"],
        "^@procosys/http/(.*)$": ["<rootDir>/src/http/$1"],
        "^@procosys/util/(.*)$": ["<rootDir>/src/util/$1"],
    },
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    setupFilesAfterEnv: ['./jest.setup.ts'],
    collectCoverage: false,
    coverageReporters: ["json", "lcov", "text", "clover", "cobertura"],
    collectCoverageFrom: [
        '**/src/**/*.{ts,tsx,js,jsx}',
        '!**/src/**/style.{ts,tsx,js,jsx}',
        '!**/node_modules/**',
        '!**/build/**',
    ],
    coverageDirectory: '.coverage'
};

export default config
