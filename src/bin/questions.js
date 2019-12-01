import git from '../lib/git'

export default {
  token: {
    text: 'GitHub access token',
    validation: (a) => {
      if (!a) {
        throw new Error('Please specify token.')
      }
    },
  },
  org: {
    text: 'GitHub organisation',
    defaultValue: null,
  },
  scope: {
    text: 'npm scope',
    postProcess(v) {
      if (!v) return v
      return v.replace(/^@/, '')
    },
    defaultValue: null,
  },
  name: {
    async getDefault() {
      const { stdout } = await git('config user.name', null, true)
      return stdout.trim()
    },
    text: 'user',
  },
  email: {
    async getDefault() {
      const { stdout } = await git('config user.email', null, true)
      return stdout.trim()
    },
    text: 'email',
  },
  website: {
    text: 'Website (for readme)',
    defaultValue: null,
  },
  trademark: {
    text: 'Trademark (for readme)',
    defaultValue: null,
  },
  legalName: {
    text: 'Legal name (for license)',
    defaultValue: null,
  },
  manager: {
    text: 'Package Manager (yarn/npm)',
    defaultValue: 'yarn',
  },
}
