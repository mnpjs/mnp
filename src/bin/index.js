#!/usr/bin/env node
import { resolve } from 'path'
import { assertDoesNotExist } from 'wrote'
import africa from 'africa'
import { askSingle } from 'reloquent'
import argufy from 'argufy'
import { c, b } from 'erte'
import getUsage from './usage'
import questions from './questions'
import cloneSource from '../lib/clone-source'
import git from '../lib/git'
import { assertNotInGitPath } from '../lib/git-lib'
import { createRepository, starRepository, deleteRepository } from '../lib/github'
import { getStructure } from '../lib'
import info from '../lib/info'

const { struct, help, name, check, delete: del } = argufy({
  struct: 's',
  help: { short: 'h', boolean: true },
  name: { command: true },
  check: 'c',
  delete: 'd',
})

const ANSWER_TIMEOUT = null

if (help) {
  const u = getUsage()
  console.log(u)
  process.exit()
}

(async () => {
  try {
    if (check) {
      console.log('Checking package %s...', check)
      const available = await info(check)
      console.log('Package named %s is %s.', available ? c(check, 'green') : c(check, 'red'), available ? 'available' : 'taken')
      return
    }
    const structure = getStructure(struct)
    const {
      org, token, name: userName, email, website, legalName,
    } = await africa('mnp', questions)

    if (del) {
      await deleteRepository(token, del, org)
      console.log('Deleted %s/%s.', org, del)
      return
    }

    const packageName = name || await askSingle({
      text: 'Package name',
      validation(a) {
        if (!a) throw new Error('You must specify package name.')
      },
    }, ANSWER_TIMEOUT)

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
