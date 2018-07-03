const { resolve } = require('path')
require('@babel/register')({
  cwd: resolve(__dirname, '../..'),
})
require('.')
