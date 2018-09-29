const { resolve } = require('path');
const { assertDoesNotExist } = require('wrote');
const { c, b } = require('erte');
const { askSingle } = require('reloquent');
let cloneSource = require('../../lib/clone-source'); if (cloneSource && cloneSource.__esModule) cloneSource = cloneSource.default;
let git = require('../../lib/git'); if (git && git.__esModule) git = git.default;
const { assertNotInGitPath } = require('../../lib/git-lib');
const { getStructure, create } = require('../../lib');

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

/** @param {import('../../lib/sign-in').Settings} settings */
const runCreate = async (settings, {
  name,
  struct,
  github,
  description: _description,
}) => {
  await assertNotInGitPath()

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

  const {
    ssh_url: sshUrl,
    git_url: gitUrl,
    html_url: htmlUrl,
  } = await github.repos.create({
    name,
    org,
    description,
    auto_init: true,
    gitignore_template: 'Node',
    homepage: website,
    license_template: 'mit',
  })

  if (!sshUrl) throw new Error('GitHub repository was not created via the API.')

  await github.activity.star(org, name)
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

module.exports=runCreate