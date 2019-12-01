import { debuglog } from 'util'
import GitHub from '@rqt/github'
import { read } from '@wrote/wrote'

const LOG = debuglog('mnp')

export default class GitHubContext {
  constructor() {
    this._created = []
  }
  get org() {
    return 'mnp-test'
  }
  async create(options) {
    const {
      name,
      owner: { login: owner },
    } = await this._github.repos.create(options)
    this._created.push({ name, owner })
  }
  async _destroy() {
    await Promise.all(this._created.map(async ({ name, owner }) => {
      try {
        await this._github.repos.delete(owner, name)
      } catch ({ message }) {
        LOG(message)
      }
    }))
  }
  async _init() {
    const token = await read('.token')
    this._github = new GitHub(token)
  }
}