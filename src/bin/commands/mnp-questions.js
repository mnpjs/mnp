import { writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'

export default {
  license: {
    text: 'Choose a license (e.g., agpl-3.0, apache-2.0, bsd-3-clause, gpl-3.0, mit, custom)\nSee full list at https://github.com/mnpjs/licenses\nLicense',
    getDefault() {
      return 'agpl-3.0'
    },
    // https://spdx.org/licenses/
    afterQuestions({ warn, addFile, resolve: res }, license) {
      const custom = {
        license_name: 'SEE LICENSE IN LICENSE',
        license_spdx: 'SEE LICENSE IN LICENSE',
        license: {
          name: 'SEE LICENSE IN LICENSE',
          spdx: 'SEE LICENSE IN LICENSE',
        },
      }
      if (license == 'custom') return custom
      const r = require('@mnpjs/licenses')
      const e = license in r
      if (!e) {
        warn(`Unknown license ${license}, settings custom.`)
        return custom
      }

      const l = join(dirname(require.resolve('@mnpjs/licenses/package.json')), 'licenses', `${license}.txt`)
      const li = readFileSync(l, 'utf8')
      writeFileSync(res('LICENSE'), li)
      addFile('LICENSE')
      return {
        license_spdx: r[license].spdx,
        license_name: r[license].name,
        license: {
          name: r[license].name,
          spdx: r[license].spdx,
        },
      }
    },
  },
  wiki: {
    text: 'Init Github Wiki',
    confirm: true,
    async afterQuestions({ confirm, git, warn, packageJson, updatePackageJson, rm },
      answer, { name, org }) {
      if (answer) {
        const a = await confirm(`Please go to https://github.com/${org}/${name}/wiki/_new
to create the first page and press enter when done.`)
        if (!a) return warn('Wiki not created.')
        const m = `git@github.com:${org}/${name}.wiki.git`
        await git('submodule', 'add', m, 'wiki.git')
        return m
      }
      delete packageJson.scripts.wiki
      updatePackageJson(packageJson)
      try {
        await rm('wiki')
      } catch (err) {
        // ok
      }
    },
  },
  homepage: {
    text: 'Homepage',
    getDefault({ repo }) {
      // give a choice here
      // - https://github.com/mnpjs/package#readme
      // - https://mnpjs.github.io/package
      // - https://mnpjs.org
      return `${repo.html_url}#readme`
    },
    async afterQuestions({ github, loading }, homepage, { repo, org, name }) {
      const def = `${repo.html_url}#readme`
      if (def == homepage) return
      await loading('Setting GitHub homepage', github.repos.edit(org, name, {
        homepage,
      }))
    },
  },
  keywords: {
    getText: ({ org, name }) => `Keywords (e.g., ${org}, ${name})`,
    async afterQuestions({ warn, loading, packageJson, updatePackageJson, github }, answer, { name, org }) {
      if (!answer) return
      const tags = answer.split(',').map(a => a.trim())
      if (!tags.length) return
      packageJson.keywords = tags
      updatePackageJson(packageJson)
      const { body, statusCode, statusMessage } = await loading('Setting topics', github._request({
        endpoint: `/repos/${org}/${name}/topics`,
        method: 'PUT',
        headers: {
          Accept: 'application/vnd.github.mercy-preview+json',
        },
        data: {
          names: tags,
        },
      }))
      if (statusCode != 200) {
        warn('Could not set GitHub topics: %s:%s', statusCode, statusMessage)
        warn(JSON.stringify(body, null, 2))
      }
      return tags
    },
  },
}