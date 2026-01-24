module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Type must be one of the allowed types
    'type-enum': [
      2,
      'always',
      [
        'feat',      // New feature
        'fix',       // Bug fix
        'refactor',  // Code refactoring
        'chore',     // Maintenance tasks
        'docs',      // Documentation changes
        'test',      // Test changes
        'perf',      // Performance improvements
        'build',     // Build system changes
      ],
    ],
    // Subject is required
    'subject-empty': [2, 'never'],
    // Subject must be lowercase (no start-case, pascal-case, or uppercase)
    'subject-case': [
      2,
      'always',
      ['lower-case'], // Only lowercase allowed
    ],
    // Scope is optional
    'scope-empty': [0],
  },
};
