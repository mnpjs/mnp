import { join } from 'path'
import { fork } from 'spawncommand'
import { Readable } from 'stream'
import SnapshotContext from 'snapshot-context'
import Context from '../context'
import TempContext from '../context/temp'

const BIN = Context.BIN

/** @type {Object.<string, (tc: TempContext, s: SnapshotContext)} */
const T = {
  context: [TempContext, SnapshotContext],
  async 'creates a new package'(
    { TEMP, PACKAGE_NAME, snapshot, rm }, { setDir, test },
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
    await Promise.all([
      rm(join(PACKAGE_NAME, 'node_modules')),
      rm(join(PACKAGE_NAME, '.git')),
      rm(join(PACKAGE_NAME, '.documentary')),
      rm(join(PACKAGE_NAME, 'yarn.lock')),
    ])
    const s = await snapshot(PACKAGE_NAME)
    await test('package.txt', s.trim())
  },
}

export default T
