const { resolve, join } = require('path');
const { assertDoesNotExist } = require('wrote');
const { c, b } = require('erte');
let askQuestions = require('reloquent'); const { askSingle } = askQuestions; if (askQuestions && askQuestions.__esModule) askQuestions = askQuestions.default;
const cloneSource = require('../../lib/clone-source'); const { getRegexes, updatePackageJson } = cloneSource;
const git = require('../../lib/git');
const { assertNotInGitPath } = require('../../lib/git-lib');
const { getStructure, create } = require('../../lib');
let GitHub = require('@rqt/github'); if (GitHub && GitHub.__esModule) GitHub = GitHub.default;
const { renameSync } = require('fs');
const { Replaceable, replace } = require('restream');
let readDirStructure = require('@wrote/read-dir-structure'); const { getFiles } = readDirStructure; if (readDirStructure && readDirStructure.__esModule) readDirStructure = readDirStructure.default;
const { read, write, rm } = require('@wrote/wrote');
// const GitHub = require(/* depack */'@rqt/github/src')

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

  const path = resolve(name)
  await assertDoesNotExist(path)

  console.log(`# ${packageName}`)

  const description = await getDescription(_description)

  let sshUrl, gitUrl, htmlUrl
  try {
    if (struct == 'splendid') {
      ({
        'ssh_url': sshUrl,
        'git_url': gitUrl,
        'html_url': htmlUrl,
      } = await github.repos.generate('mnpjs', 'splendid', {
        owner: org,
        name: name,
        description,
        // private
      }))
      // debugger
    } else {
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
    }
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
    c('⭐️  Created and starred a new repository', 'grey'),
    b(htmlUrl, 'green'),
  )

  const readmeUrl = `${htmlUrl}#readme`
  const issuesUrl = `${htmlUrl}/issues`

  await git(['clone', sshUrl, path])

  console.log('Setting user %s<%s>...', userName, email)
  await git(['config', 'user.name', userName], path)
  await git(['config', 'user.email', email], path)

  let structurePath, onCreate
  const sets = {
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
  }
  if (struct == 'splendid') {
    // read the mnp.js file
    const { questions } = require(`${path}/mnp`)
    ;({ onCreate } = require(`${path}/mnp`))
    const q = Object.entries(questions).reduce((acc, [key, getDefault]) => {
      const def = () => getDefault(sets)
      acc[key] = { text: key, getDefault: def }
      return acc
    }, {})
    const answers = await askQuestions(q)
    const answersRules = Object.entries(answers).reduce((acc, [key, replacement]) => {
      const rule = { re: new RegExp(`{{ ${key} }}`), replacement }
      acc.push(rule)
      return acc
    }, [])
    // select license
    const license = answers['License (MIT/AGPL)']
    if (license == 'MIT') {
      await rm(join(path, 'LICENSE-AGPL'))
      renameSync(join(path, 'LICENSE-MIT'), join(path, 'LICENSE'))
    } else if (license == 'AGPL') {
      await rm(join(path, 'LICENSE-MIT'))
      renameSync(join(path, 'LICENSE-AGPL'), join(path, 'LICENSE'))
    } else {
      console.warn(c(`Unknown license ${license}`, 'red'))
    }
    // go into the repo and update
    const { content } = await readDirStructure(path, {
      ignore: ['.git'],
    })
    let files = getFiles(content, path)
    files = files
      .filter(p => {
        if (/LICENSE$/.test(p)) return true
        return /\.(js|md|html|json)$/.test(p)
      })
    await Promise.all(files.map(async (p) => {
      const regexes = getRegexes(sets)
      const r = new Replaceable([
        ...answersRules,
        ...regexes,
      ])
      const file = await read(p)
      const res = await replace(r, file)
      await write(p, res)
    }))
    // add website to repo
    await github.repos.edit(org, name, {
      homepage: answers['URL'],
    })
    await rm(join(path, 'mnp.js'))
    await updatePackageJson(path, sets, false)
  } else {
    const { structure, scripts, structurePath: sp } = getStructure(struct)
    structurePath = sp
    ;({ onCreate } = scripts)

    await cloneSource(structure, path, sets)
  }

  await git('add .', path, true)
  await git(['commit', '-m', 'initialise package'], path, true)
  console.log('Initialised package structure, pushing.')
  await git('push origin master', path, true)

  if (onCreate) {
    await create(path,
      struct == 'splendid' ? path : structurePath,
      onCreate)
  }

  console.log('Created a new package: %s.', c(packageName, 'green'))
}

module.exports=runCreate

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../../').Settings} _mnp.Settings
 */