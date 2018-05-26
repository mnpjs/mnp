import makepromise from 'makepromise'
import { stat, rmdir, mkdir } from 'fs'
import { resolve, basename } from 'path'
import { readDir } from 'wrote'
import { tmpdir } from 'os'

const TEMP = resolve(tmpdir(), 'mnp_test.context')
const FIXTURES = resolve(__dirname, '../fixtures')

async function findName(parent, initialName, n = 0) {
  const currentName = `${initialName}${n ? `-${n}` : ''}`
  const path = resolve(parent, currentName)
  try {
    await makepromise(stat, path)
    throw new Error('dir exists')
  } catch (err) {
    if (err.message == 'dir exists') {
      return findName(parent, initialName, n + 1)
    }
    return path
  }
}

export default class Context {
  constructor() {
    this.cwd = TEMP
  }
  async _init() {
    this.packagePath = await findName(TEMP, 'test-package')
    this.packageName = basename(this.packagePath)

    try {
      await makepromise(mkdir, TEMP)
    } catch (err) { /* */ }

    console.log('%s expected', this.packageName)
  }
  readDir(dir) {
    return readDir(dir, true)
  }
  readExpectedStructure() {
    this.expectedStructurePath = resolve(FIXTURES, 'expected-cloned')
    return readDir(this.expectedStructurePath, true)
  }

  async _destroy() {
    try {
      await makepromise(rmdir, this.packagePath)
    } catch (err) { /* can't remove recursively */ }
  }
}
