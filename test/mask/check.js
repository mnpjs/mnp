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

// MIT (c) https://github.com/ivoputzer/m.noansi
const re = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g // eslint-disable-line

export default ts