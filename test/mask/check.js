import makeTestSuite from '@zoroaster/mask'
import Context from '../context'

const BIN = Context.BIN

export default makeTestSuite('test/result/check', {
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