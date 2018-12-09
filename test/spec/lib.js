import { deepEqual, throws, assert } from 'zoroaster/assert'
import mnpPackage from '@mnpjs/package'
import idioPackage from '@mnpjs/idio'
import { getStructure } from '../../src/lib'

export default {
  'finds a default structure'() {
    const res = getStructure()
    deepEqual(res, {
      structure: `${mnpPackage}/structure`,
      scripts: { onCreate: ['yarn'] },
      structurePath: mnpPackage,
    })
  },
  'throws an error when -s is the last argument'() {
    assert.throws(() => {
      getStructure(null)
    }, /Could not require structure "null"/)
  },
  'finds the idio structure'() {
    const res = getStructure('idio')
    deepEqual(res, {
      structure: `${idioPackage}/structure`,
      scripts: { onCreate: 'yarn' },
      structurePath: idioPackage,
    })
  },
  async 'throws an error when structure could not be required'() {
    const name = 'preact'
    await throws({
      fn: getStructure,
      args: name,
      message: `Could not require structure "${name}".`,
    })
  },
}