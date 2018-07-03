import africa from 'africa'
// import { debuglog } from 'util'
import questions from '../bin/questions'

// const LOG = debuglog('mnp')

export default async function signIn(force = false) {
  const conf = await africa('mnp', questions, {
    force,
    local: true,
  })
  return conf
}
