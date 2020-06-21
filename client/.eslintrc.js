module.exports = {
  plugins: ['jsdoc'],
  extends: [
    'react-app',
    'eslint:recommended',
    'plugin:react/recommended',
    'eslint-config-prettier',
    'plugin:jsdoc/recommended',
  ],
  rules: {
    indent: ['error', 4],
    'no-var': 2,
    semi: [2, 'always'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    camelcase: 2,
    'no-duplicate-case': 2,
    'no-dupe-else-if': 2,
    'react/require-default-props': [2, { forbidDefaultForRequired: true }],
    'react/no-unused-prop-types': [2],
    'jsdoc/check-alignment': 1, // Recommended
    'jsdoc/check-param-names': 0, // Recommended
    'jsdoc/check-tag-names': 0, // Recommended
    'jsdoc/check-types': 0, // Recommended
    'jsdoc/implements-on-classes': 1, // Recommended
    'jsdoc/newline-after-description': 1, // Recommended
    'jsdoc/no-undefined-types': 1, // Recommended
    'jsdoc/require-description-complete-sentence': 0,
    'jsdoc/require-hyphen-before-param-description': 0,
    'react/no-children-prop': 0,
    'no-prototype-builtins': 0,
    // Working for these
    'jsdoc/require-jsdoc': 0, // Recommended
    'jsdoc/require-param': 0, // Recommended
    'jsdoc/require-param-description': 0, // Recommended
    'jsdoc/require-param-name': 0, // Recommended
    'jsdoc/require-param-type': 0, // Recommended
    'jsdoc/require-returns': 0, // Recommended
    'jsdoc/require-returns-check': 0, // Recommended
    'jsdoc/require-returns-description': 0, // Recommended
    'jsdoc/require-returns-type': 0, // Recommended
    'jsdoc/valid-types': 0, // Recommended,
    'react/prop-types': 0,
  },
};
