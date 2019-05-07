import makeTestSuite from '@zoroaster/mask'
import TempContext from 'temp-context'
import { runOnCreate } from '../../src/lib'

export default makeTestSuite('test/result/run-on-create', {
  /**
   * @param {TempContext} t
   */
  async getResults({ TEMP, write, read }) {
    await write('file.js', this.input)
    await runOnCreate(TEMP, TEMP, 'file.js')
    const res = await read('result.txt')
    return res
  },
  context: TempContext,
})