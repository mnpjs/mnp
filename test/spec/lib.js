const { equal, throws } = require('zoroaster/assert')
const { resolve } = require('path')
const mnpIdio = require('mnp-idio')
const { findStructure } = require('../../src/lib')

const libTestSuite = {
  'finds a default structure'() {
    const res = findStructure(['node', 'mnp', 'test'])
    equal(res, `${resolve(__dirname, '../../structures/my-new-package')}/`)
  },
  'finds an idio structure'() {
    const res = findStructure(['node', 'mnp', 'test', '-s', 'idio'])
    const expected = `${mnpIdio}/`
    equal(res, expected)
  },
  async 'throws an error when structure could not be required'() {
    const name = 'preact'
    await throws({
      fn: findStructure,
      args: [['node', 'mnp', 'test', '-s', name]],
      message: `Could not require structure "${name}".`,
    })
  },
  'returns default structure when -s is last argument'() {
    const res = findStructure(['node', 'mnp', 'test', '-s'])
    equal(res, `${resolve(__dirname, '../../structures/my-new-package')}/`)
  },
}

module.exports = libTestSuite
