const { equal, throws, assert } = require('zoroaster/assert')
const mnpIdio = require('mnp-idio')
const mnpPackage = require('mnp-package')
const { findStructure } = require('../../src/lib')

const libTestSuite = {
  'finds a default structure'() {
    const res = findStructure(['node', 'mnp', 'test'])
    const expected = `${mnpPackage}/`
    equal(res, expected)
  },
  'throws an error when -s is the last argument'() {
    assert.throws(() => {
      findStructure(['node', 'mnp', 'test', '-s'])
    })
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
}

module.exports = libTestSuite
