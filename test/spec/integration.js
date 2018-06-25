import { stat } from 'fs'
import makepromise from 'makepromise'
import { fork } from 'spawncommand'
import { resolve } from 'path'
import { Readable } from 'stream'
import context from '../context'

const MNP = process.env.BABEL_ENV == 'test-build' ? '../../build/bin' : '../../src/bin'
const BIN = resolve(__dirname, MNP)

const T = {
  context,
  async 'creates a new package'({ cwd, packageName, packagePath }){
    const { promise, stdout, stderr, stdin } = fork(BIN, [packageName], {
      cwd,
      stdio: 'pipe',
    })
    stdout.pipe(process.stdout)
    stderr.pipe(process.stderr)
    const answer = 'test-description\n'
    const r = new Readable({
      read() {
        this.push(answer)
        this.push(null)
      },
    })
    stdin.on('error', () => {
      console.log('socket error')
    })
    r.pipe(stdin)
    await promise
    await makepromise(stat, packagePath)
  },
}

export default T
