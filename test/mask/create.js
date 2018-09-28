import { makeTestSuite } from 'zoroaster'
import TempContext from '../context/temp'
import Context from '../context'
import { tmpdir } from 'os'

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
        execArgv: [],
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
      .replace(/yarn [\s\S]+/, '')
    return r
  },
  context: TempContext,
})

// MIT (c) https://github.com/ivoputzer/m.noansi
const re = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g // eslint-disable-line

export default ts