import { stat } from 'fs'
import makepromise from 'makepromise'
import { fork } from 'spawncommand'
import { Readable } from 'stream'
import Context from '../context'

/** @type {Object.<string, (c: Context)} */
const T = {
  context: Context,
  async 'creates a new package'({ cwd, BIN, packageName, packagePath }){
    const { promise, stdout, stderr, stdin } = fork(BIN, [packageName], {
      cwd,
      stdio: 'pipe',
      execArgv: [],
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
