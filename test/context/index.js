import { join } from 'path'
import { readDir } from 'wrote'
import MNP_PACKAGE from '@mnpjs/package'

const FIXTURE = 'test/fixture'

const TEST_BUILD = process.env.ALAMODE_ENV == 'test-build'
const MNP = TEST_BUILD ? '../../build/bin' : '../../src/bin/alamode'
const BIN = join(__dirname, MNP)

export default class Context {
  /**
   * Path to the mnp executable.
   */
  static get BIN() {
    return BIN
  }
  readDir(dir) {
    return readDir(dir, true)
  }
  readExpectedStructure() {
    return readDir(this.expectedStructurePath, true)
  }
  get expectedStructurePath() {
    return join(FIXTURE, 'expected-cloned')
  }
  get MNP_PACKAGE() {
    return `${MNP_PACKAGE}/structure`
  }
  get SNAPSHOT_DIR() {
    return 'test/snapshot'
  }
}
