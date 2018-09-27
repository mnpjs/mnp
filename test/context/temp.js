import { debuglog, log } from 'util'
import { join } from 'path'
import { tmpdir } from 'os'
import TempContext from 'temp-context'
import GitHub from '@rqt/github'

const LOG = debuglog('mnp')

const TEMP = join(tmpdir(), 'mnp-test')

TempContext.setTemp(TEMP)

export default class Temp extends TempContext {
  static get ORG() {
    return 'mnp-test'
  }
  async _init() {
    await super._init()
    const token = await this.read('.token')
    const github = new GitHub(token)
    this._github = github
    const rc = JSON.stringify({
      token,
      org: Temp.ORG,
      name: 'Test',
      email: 'test@mnpjs.org',
      website: 'https://mnpjs.org',
      trademark: 'MNP',
      legalName: 'Art Deco Code Limited',
    }, null, 2)
    const pp = await this.write(rc, '.mnprc')
    LOG('Created .mnprc at %s', pp)
  }
  get PACKAGE_NAME() {
    return 'mnp-test-package'
  }
  get PACKAGE_PATH() {
    return join(this.TEMP, this.PACKAGE_NAME)
  }
  get github() {
    return this._github
  }
  async _destroy() {
    try {
      await this.github.repos.delete(Temp.ORG, this.PACKAGE_NAME)
    } catch (err) {
      log(err)
    }
    await super._destroy()
  }
}