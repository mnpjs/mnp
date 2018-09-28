import africa from 'africa'
import questions from '../bin/questions'

export default async function signIn(force = false) {
  /** @type {Settings} */
  const conf = await africa('mnp', questions, {
    force,
    local: true,
  })
  return conf
}

/** @typedef {{token: string, org: string, scope: string, name: string, email: string, website: string, trademark: string, legalName: string }} Settings */