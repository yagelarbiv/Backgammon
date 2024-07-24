module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.js' }]
  },
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  extensionsToTreatAsEsm: ['.js'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};