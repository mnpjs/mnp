import africa from 'africa'
import bosom from 'bosom'
import questions from '../bin/questions'
import { homedir } from 'os'
import { resolve } from 'path'
import { debuglog } from 'util'

const LOG = debuglog('mnp')

export default async function signIn(local = false, force = false) {
  let r
  if (local) {
    try {
      r = await bosom(resolve(homedir(), '.mnprc'))
    } catch (er) {
      LOG('Could not read the global rc file.')
    }
  }
  const c = {
    ...(local ? { homedir: '.' } : {}),
    ...(force ? { force } : {}),
  }

  const q = r ? Object.keys(questions).reduce((a, k) => {
    const v = questions[k]
    const o = {
      ...a,
      [k]: {
        ...v,
        defaultValue: r[k],
      },
    }
    return o
  }, {}) : questions

  const conf = await africa('mnp', q, c)
  return conf
}
