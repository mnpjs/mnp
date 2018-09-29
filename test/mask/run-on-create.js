import { makeTestSuite } from 'zoroaster'
import TempContext from 'temp-context'
import { runOnCreate } from '../../src/lib'

const ts = makeTestSuite('test/result/run-on-create.md', {
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

export default ts