// .eslintrc.cjs
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          '**/modules/form-elements/components/base/UI-without-validation/**'
        ],
        message: 'Use the validated Base* components, not Ui* primitives.'
      }
    ]
  }
}
