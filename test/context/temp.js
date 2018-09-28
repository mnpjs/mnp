import { debuglog, log } from 'util'
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
    await super._init()
    const token = await this.readGlobal('.token')
    this._github = new GitHub(token)

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
  async _destroy() {
    try {
      await this.github.repos.delete(Temp.ORG, this.PACKAGE_NAME)
    } catch ({ message }) {
      log(message)
    }
    await super._destroy()
  }
}