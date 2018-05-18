import { equal, throws, assert } from 'zoroaster/assert'
import mnpIdio from 'mnp-idio'
import mnpPackage from 'mnp-package'
import { findStructure } from '../../src/lib'

export default {
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
