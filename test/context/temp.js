import { debuglog } from 'util'
import TempContext from 'temp-context'
import GitHub from '@rqt/github'

const LOG = debuglog('mnp')

export default class Temp extends TempContext {
  static get ORG() {
    return 'mnp-test'
  }
  constructor() {
    super()
    this._useOSTemp(Temp.ORG)
  }
  async _init() {
    const token = await this.readGlobal('.token')
    this._github = new GitHub(token)
    await this._destroy()

    await super._init()

    const rc = JSON.stringify({
      token,
      org: Temp.ORG,
      name: 'Test',
      email: 'test@mnpjs.org',
      website: 'https://mnpjs.org',
      trademark: 'MNP',
      legalName: 'Art Deco Code Limited',
    }, null, 2)
    const pp = await this.write('.mnprc', rc)
    LOG('Created .mnprc at %s', pp)
  }
  get PACKAGE_NAME() {
    return 'mnp-test-package'
  }
  get PACKAGE_PATH() {
    return this.resolve(this.PACKAGE_NAME)
  }
  get github() {
    return this._github
  }
  async _deleteRepo() {
    try {
      await this.github.repos.delete(Temp.ORG, this.PACKAGE_NAME)
    } catch ({ message }) {
      LOG(message)
    }
  }
  async _destroy() {
    await this._deleteRepo()
    await super._destroy()
  }
}