import type { Config } from 'jest';

const config: Config = {
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      { tsconfig: './tests/tsconfig.json', useESM: true },
    ],
  },
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\./.*)\\.js$': '$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/tests/$1',
  },
};

export default config;
