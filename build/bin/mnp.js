#!/usr/bin/env node
const { askSingle } = require('reloquent');
let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;
let GitHub = require('@rqt/github'); if (GitHub && GitHub.__esModule) GitHub = GitHub.default;
const getUsage = require('./usage');
const signIn = require('../lib/sign-in');
const { version } = require('../../package.json');
const runCheck = require('./commands/check');
const runDelete = require('./commands/delete');
const runCreate = require('./commands/create');

const {
  struct, help, name: _name, check: _check, delete: _delete, init, desc: _description,
  version: _version,
} = argufy({
  struct: 's',
  help: { short: 'h', boolean: true },
  desc: { short: 'D' },
  name: { command: true },
  version: { short: 'v', boolean: true },
  check: { short: 'c', boolean: true },
  delete: { short: 'd', boolean: true },
  init: { short: 'I', boolean: true },
})

if (_version) {
  console.log(version)
  process.exit()
} else if (help) {
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
    if (init) return signIn(true)

    const name = await getName(_name)

    if (_check) return runCheck(name)

    const { token, ...settings } = await signIn()
    const github = new GitHub(token)

    if (_delete) return runDelete(github, settings.org, name)

    await runCreate(settings, {
      name,
      struct,
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