#!/usr/bin/env node
import { _version, _help, _init, _name, _check, _delete, _scope, _noScope, _desc, _private, _template } from './get-args'
import { askSingle } from 'reloquent'
import getUsage from './usage'
import signIn from '../lib/sign-in'
import runCheck from './commands/check'
import runDelete from './commands/delete'
import runCreate from './commands/create'

if (_version) {
  const version = require('../../package.json').version
  console.log(version)
  process.exit()
} else if (_help) {
  const u = getUsage()
  console.log(u)
  process.exit()
}

const getName = async (name) => {
  if (name) return name
  const res = await askSingle({
    text: 'Package name',
    validation(a) {
      if (!a) throw new Error('You must specify the package name.')
    },
  })
  return res
}

(async () => {
  try {
    if (_init) return await signIn(true)

    const name = await getName(_name)

    if (_check) return await runCheck(name)

    const { token, scope: settingsScope, template, ...settings } = await signIn()

    if (_delete) return await runDelete(token, settings.org, name)

    await runCreate({
      ...(_noScope ? {} : { scope: _scope || settingsScope }),
      ...settings,
    }, {
      name,
      template: template || _template,
      private: _private,
      token,
      description: _desc,
    })
  } catch ({ controlled, message, stack }) {
    if (/Must have admin rights to Repository/.test(message)) {
      console.log('Does your GitHub access token have "delete" rights?')
    }
    if (controlled) {
      console.error(message)
    } else {
      console.error(stack)
    }
  }
})()