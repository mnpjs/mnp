import { makeTestSuite } from 'zoroaster'
import Context from '../context'

const BIN = Context.BIN

const ts = makeTestSuite('test/result/check.md', {
  fork: {
    module: BIN,
    log: true,
  },
  mapActual({ stdout }) {
    const r = stdout
      .replace(re, '')
      .replace(/yarn [\s\S]+/, '')
    return r
  },
})

const re = /\033\[.*?m/g

export default ts