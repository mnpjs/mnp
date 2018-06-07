#!/usr/bin/env node
import { resolve } from 'path'
import { assertDoesNotExist } from 'wrote'
import africa from 'africa'
import { askQuestions } from 'reloquent'
import cloneSource from '../lib/clone-source'
import git from '../lib/git'
import { assertNotInGitPath } from '../lib/git-lib'
import { createRepository } from '../lib/github'
import { findStructure } from '../lib'
import questions from './questions'
import getUsage from './usage'

const ANSWER_TIMEOUT = null

const { argv } = process
const [, , argvPackage] = argv
const argvPackageName = argvPackage == '-s' ? null : argvPackage

const help = argv.some(a => /(-h|--help)/.test(a))
if (help) {
  const u = getUsage()
  console.log(u)
  process.exit()
}

(async () => {
  try {
    const structure = findStructure(argv)
    const {
      org, token, name, email, website, legalName,
    } = await africa('mnp', questions)

    const packageName = argvPackageName ? argvPackageName : await askQuestions({
      packageName: {
        text: 'Package name: ',
        validation(a) {
          if (!a) throw new Error('You must specify package name')
        },
      },
    }, ANSWER_TIMEOUT, 'packageName')

    const packagePath = resolve(packageName)
    await assertDoesNotExist(packagePath)

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

    await git(['clone', sshUrl, packagePath])

    console.log('Setting user %s<%s>...', name, email)
    await Promise.all([
      git(['config', 'user.name', name], packagePath),
      git(['config', 'user.email', email], packagePath),
    ])

    await cloneSource(structure, packagePath, {
      org,
      packageName,
      website,
      authorName: name,
      authorEmail: email,
      year: `${new Date().getFullYear()}`,
      issuesUrl,
      readmeUrl,
      gitUrl,
      description,
      legalName,
    })
    console.log('Cloned the structure to %s', packagePath)
    console.log('Created new repository: %s', readmeUrl)

    await git('add .', packagePath)
    await git(['commit', '-m', 'initialise package'], packagePath)
    await git('push origin master', packagePath)
  } catch ({ controlled, message, stack }) {
    if (controlled) {
      console.error(message)
    } else {
      console.error(stack)
    }
    process.exit(1)
  }
})()
