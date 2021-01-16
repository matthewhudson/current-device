module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [0, 'never'],
    'footer-leading-blank': [0, 'never'],
    'header-max-length': [1, 'always', 72],
    'subject-case': [0, 'never'],
    'subject-full-stop': [0, 'never']
  }
}
