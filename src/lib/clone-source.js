import { resolve } from 'path'
import bosom from 'bosom'

const camelCase = (s) => {
  return s.replace(/-(.)/g, (m, w) => {
    return w.toUpperCase()
  })
}

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
export const getRegexes = (sets, aliases) => {
  const {
    name, packageName, legalName,
    year = `${new Date().getFullYear()}`,
    create_date = getDefaultCreateDate(),
  } = sets

  const answers = {
    ...sets,
    'package-name': packageName,
    'full-name': packageName,
    'legal-name': legalName,
    legal_name: legalName,
    create_date,
    'create-date': create_date,
    year,
  }
  const rules = [{
    re: /{{ (\S+?) }}/g,
    // keywords? custom rule processor
    replacement(m, key) {
      try {
        const aa = key.split('.').reduce((o, i) => o[i], answers)
        if (aa) return aa
        throw new Error('not found')
      } catch (err) {
        this.api.warn('Setting %s in %s not found.', m, this.path)
        // not found
      }
      return m
    },
  }]
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
    { re: /MyNewPackage/g, replacement: cc.replace(/^./, m => m.toUpperCase()) },
    { re: /(my-new-package)/g, replacement: packageName },
    { re: /(mnp)/g, replacement: name },
  ]
  return regexes
}

export const updatePackageJson = async (path, {
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