const context = require('../context/')
const fs = require('fs')
const makePromise = require('makepromise')
const spawnCommand = require('spawncommand')
const path = require('path')
const { Readable } = require('stream')

const BIN_PATH = path.join(__dirname, '../../bin/mnp')

const myPackageNameTestSuite = {
  context,
  async 'should create a new package'({ cwd, packageName, packagePath }){
    const proc = spawnCommand(BIN_PATH, [packageName], {
      cwd,
    })
    const { promise, stdout, stderr, stdin } = proc
    stdout.pipe(process.stdout)
    stderr.pipe(process.stderr)
    const answer = 'test-description\n'
    const r = new Readable({
      read() {
        this.push(answer)
        this.push(null)
      },
    })
    r.pipe(stdin)
    await promise
    await makePromise(fs.stat, packagePath)
  },
}

module.exports = myPackageNameTestSuite
