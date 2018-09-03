#!/usr/bin/env node
import { resolve } from 'path'
import { assertDoesNotExist } from 'wrote'
import { askSingle } from 'reloquent'
import argufy from 'argufy'
import { c, b } from 'erte'
import getUsage from './usage'
import cloneSource from '../lib/clone-source'
import git from '../lib/git'
import { assertNotInGitPath } from '../lib/git-lib'
import {
  createRepository, starRepository, deleteRepository,
} from '../lib/github'
import { getStructure, create } from '../lib'
import info from '../lib/info'
import signIn from '../lib/sign-in'
import { version } from '../../package.json'

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

    const { structure, scripts, structurePath } = getStructure(struct)
    const { onCreate } = scripts

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
    if (/Must have admin rights to Repository/.test(message)) {
      console.log('Does your access token have "delete" rights?')
    }
    if (controlled) {
      console.error(message)
    } else {
      console.error(stack)
    }
    process.exit(1)
  }
})()
