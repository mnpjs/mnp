#!/usr/bin/env node
const { _version, _help, _init, _name, _check, _delete, _scope, _noScope, _struct, _description } = require('./get-args');
const { askSingle } = require('reloquent');
let GitHub = require('@rqt/github'); if (GitHub && GitHub.__esModule) GitHub = GitHub.default;
const getUsage = require('./usage');
const signIn = require('../lib/sign-in');
const { version } = require('../../package.json');
const runCheck = require('./commands/check');
const runDelete = require('./commands/delete');
const runCreate = require('./commands/create');

if (_version) {
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
    if (_init) return signIn(true)

    const name = await getName(_name)

    if (_check) return runCheck(name)

    const { token,
      scope: settingsScope, ...settings } = await signIn()
    const github = new GitHub(token)

    if (_delete) return runDelete(github, settings.org, name)

    await runCreate({
      ...(_noScope ? {} : { scope: _scope || settingsScope }),
      ...settings,
    }, {
      name,
      struct: _struct,
      github,
      description: _description,
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