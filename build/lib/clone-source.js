const { resolve } = require('path');
const { bosom } = require('../../stdlib');
const { clone } = require('wrote');
let camelCase = require('camel-case'); if (camelCase && camelCase.__esModule) camelCase = camelCase.default;

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getDefaultCreateDate() {
  const d = new Date()
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`
}

/**
 * Creates template regexes based on settings.
 * @param {Object} sets
 */
const getRegexes = (sets, aliases) => {
  const {
    name, packageName, legalName,
    year = `${new Date().getFullYear()}`,
    create_date = getDefaultCreateDate(), keywords = [],
  } = sets

  const keywordsReplacement = keywords
    .map(k => `"${k}"`).join(', ')
    .replace(/^"/, '').replace(/"$/, '')


  const answers = {
    ...sets,
    'package-name': packageName,
    'full-name': packageName,
    'legal-name': legalName,
    keywords: keywordsReplacement,
    legal_name: legalName,
    'create-date': create_date,
    year,
  }
  const rules = Object.entries(answers).reduce((acc, [key, replacement]) => {
    const rule = { re: new RegExp(`{{ ${key} }}`), replacement }
    acc.push(rule)
    return acc
  }, [])
  const aliasesRules = Object.entries(aliases).reduce((acc, [re, replacement]) => {
    if (typeof re == 'string') {
      re = new RegExp(re.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')
    }
    const rule = { re, replacement }
    acc.push(rule)
    return acc
  }, [])

  const cc = camelCase(name)

  const regexes = [
    ...rules,
    ...aliasesRules,
    { re: /myNewPackage/g, replacement: cc },
    { re: /MyNewPackage/g, replacement:
      cc.replace(/^./, m => m.toUpperCase()) },
    { re: /(my-new-package)/g, replacement: packageName },
    { re: /(mnp)/g, replacement: name },
  ]
  return regexes
}

const updatePackageJson = async (path, {
  keywords, readme_url,
}, homepage = true) => {
  try {
    const packageJson = resolve(path, 'package.json')
    const p = await bosom(packageJson)
    const pp = {
      ...p,
      keywords,
      ...(homepage ? { homepage: readme_url } : {} ),
    }
    await bosom(packageJson, pp, { space: 2 })
  } catch (err) {/* no package.json */ }
}

async function cloneSource(from, to, sets = {}) {
  const res = await clone({
    to,
    from,
    regexes: getRegexes(sets),
  })
  await updatePackageJson(to, sets)
  return res
}


module.exports = cloneSource
module.exports.getRegexes = getRegexes
module.exports.updatePackageJson = updatePackageJson