const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

const esModules = ['lodash-es', '@mui', '@emotion', '@swipejobs'].join('|');

module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  preset: 'ts-jest/presets/js-with-babel',
  roots: ['src'],
  setupFiles: ['./test/test-setup.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
    '^.+\\.(js|tsx|ts)$': 'babel-jest',
  },
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!(${esModules}))`],
  testRegex: '(/__tests__/.*(!test_disabled)|\\.(test|spec))\\.(ts|tsx|js)$',
  globals: {
    '@swc/jest': {
      tsconfig: './tsconfig.json',
    },
  },
  moduleDirectories: ['<rootDir>', 'node_modules', 'src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
    ...pathsToModuleNameMapper(compilerOptions.paths),
  },
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/models/',
    '/stories/',
    '/src/constants.ts',
    '/src/index.ts',
    'styles.tsx?',
    '/__tests__/',
    '/src/.*.test.tsx?',
    '/src/.*.stories..*',
  ],
  collectCoverageFrom: ['src/**/*.{js,ts,tsx}', '!src/test/*.{js,ts,tsx}', '!src/**/__tests__/'],
};
