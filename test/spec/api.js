import { equal } from '@zoroaster/assert'
import TempContext from 'temp-context'
import API from '../../src/lib/api'

/** @type {Object<string, (t:TempContext)} */
const T = {
  context: TempContext,
  async'removes blocks'({ TEMP, write, read }) {
    const f = 'test.js'
    const path = await write(f, `hello
/* block-start */
abc
/* block-end */
`)
    const api = new API(TEMP, [
      path,
    ])
    await api.removeBlocks('block')
    const res = await read(f)
    equal(res, `hello
`)
  },
  async'removes blocks same line'({ TEMP, write, read }) {
    const f = 'test.js'
    const path = await write(f, 'hello /* block-start */abc/* block-end */')
    const api = new API(TEMP, [
      path,
    ])
    await api.removeBlocks('block')
    const res = await read(f)
    equal(res, 'hello ')
  },
  async'keeps blocks'({ TEMP, write, read }) {
    const f = 'test.js'
    const path = await write(f, `hello
/* block-start */
abc
/* block-end */
`)
    const api = new API(TEMP, [
      path,
    ])
    await api.keepBlocks('block')
    const res = await read(f)
    equal(res, `hello
abc
`)
  },
  async'keeps blocks same line'({ TEMP, write, read }) {
    const f = 'test.js'
    const path = await write(f, 'hello /* block-start */abc/* block-end */')
    const api = new API(TEMP, [
      path,
    ])
    await api.keepBlocks('block')
    const res = await read(f)
    equal(res, 'hello abc')
  },
}

export default T