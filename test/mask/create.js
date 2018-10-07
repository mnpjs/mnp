import { makeTestSuite } from 'zoroaster'
import TempContext from '../context/temp'
import Context from '../context'

const BIN = Context.BIN

const ts = makeTestSuite('test/result/create.md', {
  fork: {
    module: BIN,
    /**
     * @param {string[]}
     * @param {TempContext}
     */
    async getArgs(args, { PACKAGE_NAME }) {
      return [PACKAGE_NAME, ...args]
    },
    /** @param {TempContext} */
    getOptions({ TEMP }) {
      return {
        cwd: TEMP,
      }
    },
    inputs: [
      [/Description/, 'test-description'],
    ],
    log: true,
  },
  mapActual({ stdout }) {
    const r = stdout
      .replace(re, '')
      .replace(/yarn [\s\S]+?Created/, 'Created') // when not debugging, this will be missing?
      .replace(/\[1\/4\] [\s\S]+?Created/, 'Created')
    return r
  },
  context: TempContext,
})

const re = /\033\[.*?m/g

export default ts