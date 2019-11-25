const { resolve } = require('path');
let bosom = require('bosom'); if (bosom && bosom.__esModule) bosom = bosom.default;
const { clone } = require('wrote');
let camelCase = require('camel-case'); if (camelCase && camelCase.__esModule) camelCase = camelCase.default;

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function getDefaultCreateDate() {
  const d = new Date()
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`
}

const getRegexes = ({
  name, packageName, org, legalName, trademark, website,
  issuesUrl, readmeUrl, authorName, authorEmail, year = `${new Date().getFullYear()}`,
  gitUrl, description, createDate = getDefaultCreateDate(), keywords = [],
}) => {
  const keywordsReplacement = keywords
    .map(k => `"${k}"`).join(', ')
    .replace(/^"/, '').replace(/"$/, '')

  const regexes = [
    { re: /{{ full-name }}/g, replacement: packageName },
    { re: /myNewPackage/g, replacement: camelCase(name) },
    { re: /MyNewPackage/g, replacement:
      camelCase(name).replace(/^./, m => m.toUpperCase()) },
    { re: /(my-new-package|{{ package-name }})/g, replacement: packageName }, {
      re: /{{ year }}/g,
      replacement: year,
    }, {
      re: /{{ org }}/g,
      replacement: org,
    }, {
      re: /{{ legal_name }}/g,
      replacement: legalName,
    }, {
      re: /{{ trademark }}/g,
      replacement: trademark,
    }, {
      re: /{{ website }}/g,
      replacement: website,
    }, {
      re: /{{ issues_url }}/g,
      replacement: issuesUrl,
    }, {
      re: /{{ readme_url }}/g,
      replacement: readmeUrl,
    }, {
      re: /{{ author_name }}/g,
      replacement: authorName,
    }, {
      re: /{{ author_email }}/g,
      replacement: authorEmail,
    }, {
      re: /{{ keywords }}/g,
      replacement: keywordsReplacement,
    }, {
      re: /{{ git_url }}/g,
      replacement: gitUrl,
    }, {
      re: /{{ description }}/g,
      replacement: description,
    }, {
      re: /{{ create_date }}/g,
      replacement: createDate,
    },
  ]
  return regexes
}

const updatePackageJson = async (path, {
  packageName, description, gitUrl, keywords, authorName, authorEmail,
  issuesUrl, readmeUrl,
}, homepage = true) => {
  try {
    const packageJson = resolve(path, 'package.json')
    const p = await bosom(packageJson)
    const pp = {
      ...p,
      name: packageName,
      description,
      repository: {
        type: 'git',
        url: gitUrl,
      },
      keywords,
      author: `${authorName} <${authorEmail}>`,
      bugs: {
        url: issuesUrl,
      },
      ...(homepage ? { homepage: readmeUrl } : {} ),
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