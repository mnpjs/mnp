import { resolve } from 'path'
import { assertDoesNotExist } from 'wrote'
import { c, b } from 'erte'
import { askSingle } from 'reloquent'
import cloneSource from '../../lib/clone-source'
import git from '../../lib/git'
import { assertNotInGitPath } from '../../lib/git-lib'
import { getStructure, create } from '../../lib'
const GitHub = require(/* depack */'@rqt/github')

const getDescription = async (description) => {
  if (description) return description
  const res = await askSingle({
    text: 'Description',
    postProcess: s => s.trim(),
    defaultValue: '',
  })
  return res
}

const getPackageNameWithScope = (packageName, scope) => {
  return `${scope ? `@${scope}/` : ''}${packageName}`
}

/**
 * @param {_mnp.Settings} settings
 */
const runCreate = async (settings, {
  name,
  struct,
  token,
  description: _description,
}) => {
  await assertNotInGitPath()
  const github = new GitHub(token)
  const {
    org,
    website,
    scope,
    name: userName,
    email,
    legalName,
    trademark,
  } = settings
  const packageName = getPackageNameWithScope(name, scope)
  const { structure, scripts, structurePath } = getStructure(struct)
  const { onCreate } = scripts

  const path = resolve(name)
  await assertDoesNotExist(path)

  console.log(`# ${packageName}`)

  const description = await getDescription(_description)

  let sshUrl, gitUrl, htmlUrl
  try {
    ({
      'ssh_url': sshUrl,
      'git_url': gitUrl,
      'html_url': htmlUrl,
    } = await github['repos']['create']({
      'name': name,
      'org': org,
      'description': description,
      'auto_init': true,
      'gitignore_template': 'Node',
      'homepage': website,
      'license_template': 'mit',
    }))
  } catch (err) {
    if (err.message == 'Repository: name already exists on this account') {
      const l = org ? ` https://github.com/${org}/${name}` : ''
      const e = new Error(`Repository${l} already exists.`)
      e.controlled = 1
      throw e
    }
    err.controlled = 1
    throw err
  }

  if (!sshUrl)
    throw new Error('GitHub repository was not created via the API.')

  await github['activity']['star'](org, name)
  console.log(
    '%s\n%s',
    c('Created and starred a new repository', 'grey'),
    b(htmlUrl, 'green'),
  )

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
}

export default runCreate

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../../').Settings} _mnp.Settings
 */