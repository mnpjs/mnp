import { deepEqual, throws, assert } from 'zoroaster/assert'
import mnpIdio from 'mnp-idio'
import mnpPackage from '@mnpjs/package'
import { resolve } from 'path'
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
  // 'finds an idio structure'() {
  //   const res = getStructure('idio')
  //   deepEqual(res, {
  //     structure: mnpIdio,
  //     scripts: {},
  //     structurePath: resolve(mnpIdio, '..'),
  //   })
  // },
  async 'throws an error when structure could not be required'() {
    const name = 'preact'
    await throws({
      fn: getStructure,
      args: [name],
      message: `Could not require structure "${name}".`,
    })
  },
}
