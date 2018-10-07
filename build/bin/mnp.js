#!/usr/bin/env node
const { askSingle } = require('reloquent');
let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;
let GitHub = require('@rqt/github'); if (GitHub && GitHub.__esModule) GitHub = GitHub.default;
let getUsage = require('./usage'); if (getUsage && getUsage.__esModule) getUsage = getUsage.default;
let signIn = require('../lib/sign-in'); if (signIn && signIn.__esModule) signIn = signIn.default;
const { version } = require('../../package.json');
let runCheck = require('./commands/check'); if (runCheck && runCheck.__esModule) runCheck = runCheck.default;
let runDelete = require('./commands/delete'); if (runDelete && runDelete.__esModule) runDelete = runDelete.default;
let runCreate = require('./commands/create'); if (runCreate && runCreate.__esModule) runCreate = runCreate.default;

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