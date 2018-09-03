#!/usr/bin/env node
const { resolve } = require('path');
const { assertDoesNotExist } = require('wrote');
const { askSingle } = require('reloquent');
let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;
const { c, b } = require('erte');
let getUsage = require('./usage'); if (getUsage && getUsage.__esModule) getUsage = getUsage.default;
let cloneSource = require('../lib/clone-source'); if (cloneSource && cloneSource.__esModule) cloneSource = cloneSource.default;
let git = require('../lib/git'); if (git && git.__esModule) git = git.default;
const { assertNotInGitPath } = require('../lib/git-lib');
const { createRepository, starRepository, deleteRepository } = require('../lib/github');
const { getStructure, create } = require('../lib');
let info = require('../lib/info'); if (info && info.__esModule) info = info.default;
let signIn = require('../lib/sign-in'); if (signIn && signIn.__esModule) signIn = signIn.default;
const { version } = require('../../package.json');

const {
  struct, help, name: _name, check, delete: _delete, init, desc: _description,
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
}

const ANSWER_TIMEOUT = null

const makeGitLinks = (org, name) => ({
  ssh_url: `git://github.com/${org}/${name}.git`,
  git_url: 123,
  html_url: `https://github.com/${org}/${name}#readme`,
})

if (help) {
  const u = getUsage()
  console.log(u)
  process.exit()
}

const getPackageNameWithScope = (packageName, scope) => {
  return `${scope ? `@${scope}/` : ''}${packageName}`
}

(async () => {
  try {
    if (init) {
      await signIn(true)
      return
    }

    const name = _name || await askSingle({
      text: 'Package name',
      validation(a) {
        if (!a) throw new Error('You must specify the package name.')
      },
    }, ANSWER_TIMEOUT)

    if (check) {
      console.log('Checking package %s...', name)
      const available = await info(name)
      console.log('Package named %s is %s.', available ? c(name, 'green') : c(name, 'red'), available ? 'available' : 'taken')
      return
    }

    const { structure, scripts, structurePath } = getStructure(struct)
    const { onCreate } = scripts

    const {
      org, token, name: userName, email, website, legalName, trademark, scope,
    } = await signIn()

    const packageName = getPackageNameWithScope(name, scope)

    if (_delete) {
      const y = await askSingle(`Are you sure you want to delete ${packageName}?`)
      if (y != 'y') return
      await deleteRepository(token, name, org)
      console.log('Deleted %s/%s.', org, name)
      return
    }

    const path = resolve(name)
    await assertDoesNotExist(path)

    await assertNotInGitPath()

    console.log(`# ${packageName}`)

    const description = _description || await askSingle({
      text: 'Description',
      postProcess: s => s.trim(),
      defaultValue: '',
    }, ANSWER_TIMEOUT)

    const {
      ssh_url: sshUrl,
      git_url: gitUrl,
      html_url: htmlUrl,
    } = await createRepository(token, name, org, description)

    if (!sshUrl) throw new Error('GitHub repository was not created via API.')

    await starRepository(token, name, org)
    console.log('%s\n%s', c('Created and starred a new repository', 'grey'), b(htmlUrl, 'green'))

    const readmeUrl = `${htmlUrl}#readme`
    const issuesUrl = `${htmlUrl}/issues`

    await git(['clone', sshUrl, path])

    console.log('Setting user %s<%s>...', userName, email)
    await git(['config', 'user.name', userName], path)
    await git(['config', 'user.email', email], path)

    await cloneSource(structure, path, {
      org,
      name,
      scope,
      packageName,
      website,
      authorName: userName,
      authorEmail: email,
      issuesUrl,
      readmeUrl,
      gitUrl,
      description,
      legalName,
      trademark,
    })

    await git('add .', path, true)
    await git(['commit', '-m', 'initialise package'], path, true)
    console.log('Initialised package structure, pushing.')
    await git('push origin master', path, true)

    if (onCreate) {
      await create(path, structurePath, onCreate)
    }

    console.log('Created a new package: %s.', c(packageName, 'green'))
  } catch ({ controlled, message, stack }) {
    if (controlled) {
      console.error(message)
    } else {
      console.error(stack)
    }
    process.exit(1)
  }
})()

//# sourceMappingURL=index.js.map