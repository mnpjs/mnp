import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import { runOnCreate } from '../../src/lib'

export default makeTestSuite('test/result/run-on-create', {
  /**
   * @param {string} input
   * @param {TempContext} t
   */
  async getResults(input, { TEMP, write, read }) {
    await write('file.js', input)
    await runOnCreate(TEMP, TEMP, 'file.js')
    const res = await read('result.txt')
    return res
  },
  context: TempContext,
})