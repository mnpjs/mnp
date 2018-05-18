import git from '../lib/git'

export default {
  token: {
    text: 'GitHub access token: ',
    validation: (a) => {
      if (!a) {
        throw new Error('Please specify token')
      }
    },
  },
  org: {
    text: 'GitHub organisation: ',
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
    text: 'Website (for readme): ',
    defaultValue: null,
  },
  legalName: {
    text: 'Legal name (for readme & license): ',
    defaultValue: null,
  },
}
