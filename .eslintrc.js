'use strict';

module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: 'standard',
  parser: 'babel-eslint',
  rules: {
    indent: ['error', 2],
    semi: ['error', 'always'],
    'space-before-function-paren': ['error', 'never'],
    'brace-style': ['error', 'stroustrup'],
    'eol-last': ['error', 'never']
  }
};