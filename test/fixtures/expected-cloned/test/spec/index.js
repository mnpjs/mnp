import { equal } from 'zoroaster/assert'
import Context from '../context'
import testPackage_10 from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof testPackage_10, 'function')
  },
  async 'calls package without error'() {
    await testPackage_10()
  },
  async 'calls test context method'({ example }) {
    await example()
  },
}

export default T
