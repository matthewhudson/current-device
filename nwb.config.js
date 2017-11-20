module.exports = {
  type: 'web-module',
  npm: {
    esModules: true,
    umd: {
      global: 'device',
      externals: {}
    }
  }
}
