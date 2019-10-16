const { defaults } = require('jest-config');

module.exports = {
    preset: 'ts-jest',
    "roots": [
        "<rootDir>/src"
    ],
    "transform": {
        "^.+\\.jsx?$": "babel-jest", // Adding this line solved the issue
        "^.+\\.tsx?$": "ts-jest"
    },
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
    moduleNameMapper: {
        "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
        "\\.(css|less)$": "<rootDir>/__mocks__/fileMock.js"
    },
    testPathIgnorePatterns: ['/node_modules/', '/build/'],
    setupFilesAfterEnv: ['./jest.setup.js'],
};
