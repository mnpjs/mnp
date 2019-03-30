import makeTestSuite from '@zoroaster/mask'
import TempContext from '../context/temp'
import Context from '../context'

const BIN = Context.BIN

export default makeTestSuite('test/result/create', {
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
    preprocess: {
      stdout(stdout) {
        const r = stdout
          .replace(re, '')
          // when not debugging, this will be missing?
          .replace(/yarn [\s\S]+?Created/, 'Created')
          .replace(/\[1\/4\] [\s\S]+?Created/, 'Created')
        return r
      },
    },
  },
  context: TempContext,
})

const re = /\033\[.*?m/g