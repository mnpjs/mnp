import { join } from 'path'
import rm from '@wrote/rm'
import { fork } from 'spawncommand'
import { Readable } from 'stream'
import Context from '../context'
import TempContext from '../context/temp'
import SnapshotContext from 'snapshot-context'

const BIN = Context.BIN

/** @type {Object.<string, (tc: TempContext, s: SnapshotContext)} */
const T = {
  context: [TempContext, SnapshotContext],
  async 'creates a new package'(
    { TEMP, PACKAGE_NAME, snapshot }, { setDir, test },
  ) {
    setDir('test/snapshot')
    const { promise, stdout, stderr, stdin } = fork(BIN, [PACKAGE_NAME], {
      cwd: TEMP,
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
    await rm(join(TEMP, PACKAGE_NAME, 'node_modules'))
    await rm(join(TEMP, PACKAGE_NAME, '.git'))
    await rm(join(TEMP, PACKAGE_NAME, '.documentary'))
    const s = await snapshot(PACKAGE_NAME)
    await test('package.txt', s.trim())
  },
}

export default T
