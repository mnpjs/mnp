import { makeTestSuite } from 'zoroaster'
import GitHubContext from '../context/GitHub'
import TempContext from '../context/temp'
import Context from '../context'

const BIN = Context.BIN

const ts = makeTestSuite('test/result/delete.md', {
  fork: {
    module: BIN,
    /**
     * @param {string[]}
     * @param {TempContext}
     * @param {GitHubContext}
     */
    async getArgs(args, _, { create, org }) {
      const name = 'test-delete'
      await create({
        name,
        org,
      })
      return [name, ...args]
    },
    getOptions({ TEMP }) {
      return {
        cwd: TEMP,
        execArgv: [],
      }
    },
    inputs: [
      [/Are you sure/, 'y'],
    ],
    log: true,
  },
  context: [TempContext, GitHubContext],
})

export default ts