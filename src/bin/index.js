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
import { createRepository, starRepository, deleteRepository } from '../lib/github'
import { getStructure } from '../lib'
import info from '../lib/info'
import signIn from '../lib/sign-in'

const { struct, help, name: _name, check, delete: del, init, local: _local } = argufy({
  struct: 's',
  help: { short: 'h', boolean: true },
  name: { command: true },
  check: { short: 'c', boolean: true },
  delete: 'd',
  init: { short: 'I', boolean: true },
  local: { short: 'l', boolean: true },
})

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

(async () => {
  try {
    if (init) {
      await signIn(_local, true)
      return
    }
    if (del) {
      await deleteRepository(token, del, org)
      console.log('Deleted %s/%s.', org, del)
      return
    }

    const packageName = _name || await askSingle({
      text: 'Package name',
      validation(a) {
        if (!a) throw new Error('You must specify package name.')
      },
    }, ANSWER_TIMEOUT)

    if (check) {
      console.log('Checking package %s...', packageName)
      const available = await info(packageName)
      console.log('Package named %s is %s.', available ? c(packageName, 'green') : c(packageName, 'red'), available ? 'available' : 'taken')
      return
    }

    const structure = getStructure(struct)
    const {
      org, token, name: userName, email, website, legalName,
    } = await signIn(_local)

    const path = resolve(packageName)
    await assertDoesNotExist(path)

    await assertNotInGitPath()

    console.log(`# ${packageName}`)

    const description = await askSingle({
      text: 'Description',
      postProcess: s => s.trim(),
      defaultValue: '',
    }, ANSWER_TIMEOUT)

    const {
      ssh_url: sshUrl,
      git_url: gitUrl,
      html_url: htmlUrl,
    } = await createRepository(token, packageName, org, description)

    if (!sshUrl) throw new Error('GitHub repository was not created via API.')

    await starRepository(token, packageName, org)
    console.log('%s\n%s', c('Created and starred a new repository', 'grey'), b(htmlUrl, 'green'))

    const readmeUrl = `${htmlUrl}#readme`
    const issuesUrl = `${htmlUrl}/issues`

    await git(['clone', sshUrl, path])

    console.log('Setting user %s<%s>...', userName, email)
    await git(['config', 'user.name', userName], path)
    await git(['config', 'user.email', email], path)

    await cloneSource(structure, path, {
      org,
      packageName,
      website,
      authorName: userName,
      authorEmail: email,
      year: `${new Date().getFullYear()}`,
      issuesUrl,
      readmeUrl,
      gitUrl,
      description,
      legalName,
    })

    await git('add .', path, true)
    await git(['commit', '-m', 'initialise package'], path, true)
    console.log('Initialised package structure, pushing.')
    await git('push origin master', path, true)

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
