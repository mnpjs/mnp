const { resolve, join } = require('path');
const { c, b } = require('../../../stdlib');
const               { askQuestions, askSingle } = require('../../../stdlib');
const { getRegexes } = require('../../lib/clone-source');
const git = require('../../lib/git');
const { assertNotInGitPath } = require('../../lib/git-lib');
let GitHub = require('@rqt/github'); if (GitHub && GitHub.__esModule) GitHub = GitHub.default;
const                   { readDirStructure, getFiles } = require('../../../stdlib');
const { rm, exists } = require('../../../stdlib');
const { indicatrix } = require('../../../stdlib');
const API = require('../../lib/api');
const mnpQuestions = require('./mnp-questions');
const { spawnSync } = require('child_process');
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

const DEFAULT_FILENAMES = ['LICENSE', '.gitignore', '.eslintrc']
const DEFAULT_EXTENSIONS = ['js','jsx','md','html','json','css','xml']

/**
 * @param {string} struct
 */
const getTemplate = (struct = '') => {
  const knownTemplates = {
    splendid: { 'org': 'mnpjs', name: 'splendid' },
    package: { 'org': 'mnpjs', name: 'package' },
  }
  let t = knownTemplates[struct]
  if (!t) {
    const [sorg, sname] = struct.split('/')
    if (!sname) throw new Error('Please pass template in org/name format.')
    t = { org: sorg, name: sname }
  }
  return t
}

const getAllFiles = async (path, filenames, fileExtensions) => {
  const { content } = await readDirStructure(path, {
    ignore: ['.git'],
  })
  let files = getFiles(content, path)

  if (typeof filenames == 'function') {
    filenames = filenames(DEFAULT_FILENAMES)
  }
  if (typeof fileExtensions == 'function') {
    fileExtensions = fileExtensions(DEFAULT_EXTENSIONS)
  }
  const fer = new RegExp(`\\.(${fileExtensions.join('|')})$`)

  const fns = filenames
    .filter(f => typeof f == 'string')
    .map(f => join(path, f))
  const fnre = filenames
    .filter(f => f instanceof RegExp)

  files = files
    .filter(p => {
      if (fns.includes(p)) return true
      const matches = fnre.some((re) => {
        re.lastIndex = 0
        return re.test(p)
      })
      if (matches) return true
      fer.lastIndex = 0
      return fer.test(p)
    })
  return files
}

/**
 * @param {_mnp.Settings} settings
 */
async function runCreate(settings, {
  name,
  repo: repoName = name,
  template,
  private: priv = false,
  token,
  description: _description,
}) {
  await assertNotInGitPath()
  const github = new GitHub(token)
  const { org, scope, name: userName, email } = settings
  const packageName = getPackageNameWithScope(name, scope)

  const path = resolve(name)
  if ((await exists(path))) throw new Error(`Path ${path} exists.`)

  console.log(`# ${packageName}`)

  const description = await getDescription(_description)

  // let ssh_url, git_url, html_url
  const templ = getTemplate(template)
  const repo = await indicatrix('Generating repository', github.repos.generate(templ.org, templ.name, {
    owner: org,
    name: repoName,
    description,
    private: priv,
  }))
  const { ssh_url, html_url } = repo

  if (!ssh_url)
    throw new Error('GitHub repository was not created via the API.')

  await indicatrix('Starring', github.activity.star(org, name))
  console.log(
    '%s\n%s',
    c(`⭐️ Created and starred a new${priv ? ' private' : ''} repository`, 'grey'),
    b(html_url, 'green'),
  )

  const { code } = await git(['clone', ssh_url, path])
  if (code) {
    console.log('git clone failed.\nYou should call mnp % -d and try again.', repoName)
    return
  }

  console.log('Setting user %s<%s>...', userName, email)
  await git(['config', 'user.name', userName], path)
  await git(['config', 'user.email', email], path)

  const sets = {
    ...settings,
    name,
    packageName,
    author_name: userName,
    author_email: email,
    repo,
    description,
  }
  // read the mnp.js file
  require('alamode')()
  let { questions, mnpQuestions: mnpq = ['license'],
    afterInit, afterCommit, preUpdate, files: {
      extensions: fileExtensions = DEFAULT_EXTENSIONS,
      filenames = DEFAULT_FILENAMES,
    } = {} } = require(`${path}/mnp`)

  const files = await getAllFiles(path, filenames, fileExtensions)

  const api = new API(path, files, github, sets)

  const mnpQ = Object.entries(mnpQuestions).reduce((acc, [k, v]) => {
    if (mnpq.includes(k)) acc[k] = v
    return acc
  }, {})
  const { q, afterQuestions } = await reduceTemplate({
    ...questions,
    ...mnpQ,
    ...questions,
  }, sets, api.proxy)

  const answers = await askQuestions(q)
  const aliases = Object.entries(q).reduce((acc, [key, { alias }]) => {
    if (alias) acc[alias] = answers[key]
    return acc
  }, {})
  Object.assign(sets, answers)

  await api.fixGitignore()

  await Object.entries(afterQuestions).reduce(async (acc, [key, fn]) => {
    await acc
    const res = await fn()
    if (typeof res == 'string')
      sets[key] = res
    else Object.assign(sets, res)
  }, {})

  if (preUpdate) await preUpdate(sets, api.proxy)

  // go into the repo and update with core replacements
  const regexes = getRegexes(sets, aliases)

  await api.updateFiles(regexes)

  if (afterInit) await afterInit(sets, api.proxy)

  try {
    await rm(join(path, 'mnp.js'))
  } catch (er) {
    await rm(join(path, 'mnp'))
  }

  await git('add .', path, true)
  await git(['commit', '-m', 'initialise package'], path, true)
  if (afterCommit) await afterCommit(sets, api.proxy)
  await indicatrix('Initialised package structure, pushing', git('push origin master --follow-tags', path, true))

  console.log('Created a new package: %s.', c(packageName, 'green'))

  try {
    spawnSync('code', [path], {
      shell: process.platform == 'win32',
    })
  } catch (err) {
    // no code
  }
}

/**
 * @param {Object} questions The array with template questions.
 * @param {Object} sets The settings.
 * @param {Object} api The API methods.
 */
const reduceTemplate = async (questions, sets, api) => {
  const aq = {}
  const q = await Object.entries(questions).reduce(async (acc, [key, qq]) => {
    /** @type {_reloquent.Question} */
    acc = await acc
    const question = { text: qq.text || key, alias: qq.alias }
    if (qq.getText) {
      const text = await qq.getText(sets)
      question.text = text
    }
    if (typeof qq == 'function') {
      const def = () => qq(sets)
      question.getDefault = def
    } else {
      const { getDefault, confirm } = qq
      let { afterQuestions } = qq
      if (confirm !== undefined) {
        question.text = `${question.text} [y/n]`
        if (confirm) question.defaultValue = 'y'
        else question.defaultValue = 'n'
        question.postProcess = (a) => a == 'y'
      } else if (getDefault) {
        question.getDefault = () => getDefault(sets)
      }
      if (afterQuestions) {
        const boundAfterQuestions = () => {
          return afterQuestions(api, sets[key], sets)
        }
        aq[key] = boundAfterQuestions
      }
    }
    acc[key] = question
    return acc
  }, {})
  return { q, afterQuestions: aq }
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../../../').Settings} _mnp.Settings
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('restream').Rule} _restream.Rule
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('reloquent/types').Question} _reloquent.Question
 */

// try {
//   githubInfo =
//   // debugger
// } catch (err) {
//   if (err.message == 'Repository: name already exists on this account') {
//     const l = org ? ` https://github.com/${org}/${name}` : ''
//     const er = new Error(`Repository${l} already exists.`)
//     er.controlled = 1
//     throw er
//   }
//   err.controlled = 1
//   throw err
// }

module.exports = runCreate