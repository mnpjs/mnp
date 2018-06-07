#!/usr/bin/env node
import { resolve } from 'path'
import { assertDoesNotExist } from 'wrote'
import africa from 'africa'
import { askQuestions } from 'reloquent'
import cloneSource from '../lib/clone-source'
import git from '../lib/git'
import { assertNotInGitPath } from '../lib/git-lib'
import { createRepository } from '../lib/github'
import { getStructure } from '../lib'
import questions from './questions'
import getUsage from './usage'
import argufy from 'argufy'
import info from '../lib/info'
import { c } from 'erte'

const { struct, help, name, check } = argufy({
  struct: 's',
  help: { short: 'h', boolean: true },
  name: { command: true },
  check: 'c',
}, process.argv)

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

    const packageName = name ? name : await askQuestions({
      packageName: {
        text: 'Package name: ',
        validation(a) {
          if (!a) throw new Error('You must specify package name')
        },
      },
    }, ANSWER_TIMEOUT, 'packageName')

    const path = resolve(packageName)
    await assertDoesNotExist(path)

    await assertNotInGitPath()

    console.log(`# ${packageName}`)

    const description = await askQuestions({
      description: {
        text: 'Description: ',
        postProcess: s => s.trim(),
        defaultValue: '',
      },
    }, ANSWER_TIMEOUT, 'description')

    const {
      ssh_url: sshUrl,
      git_url: gitUrl,
      html_url: htmlUrl,
    } = await createRepository(token, packageName, org, description)

    if (!sshUrl) throw new Error('GitHub repository was not created via API.')

    const readmeUrl = `${htmlUrl}#readme`
    const issuesUrl = `${htmlUrl}/issues`

    await git(['clone', sshUrl, path])

    console.log('Setting user %s<%s>...', userName, email)
    await Promise.all([
      git(['config', 'user.name', userName], path),
      git(['config', 'user.email', email], path),
    ])

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
    console.log('Cloned the structure to %s', path)
    console.log('Created new repository: %s', readmeUrl)

    await git('add .', path)
    await git(['commit', '-m', 'initialise package'], path)
    await git('push origin master', path)
  } catch ({ controlled, message, stack }) {
    if (controlled) {
      console.error(message)
    } else {
      console.error(stack)
    }
    process.exit(1)
  }
})()
