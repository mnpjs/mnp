import { join } from 'path'
import SnapshotContext from 'snapshot-context'
import Context from '../context'
import TempContext from '../context/temp'
import cloneSource from '../../src/lib/clone-source'

/** @type {Object.<string, (c: Context, t: TempContext, s: SnapshotContext)>} */
const T = {
  context: [Context, TempContext, SnapshotContext],
  async 'updates references in files'(
    { SNAPSHOT_DIR, MNP_PACKAGE },
    { PACKAGE_NAME, PACKAGE_PATH, snapshot, rm },
    { setDir, test },
  ) {
    setDir(SNAPSHOT_DIR)
    const org = 'test-org'
    const name = 'test-package-10'
    const scope = '@adc'
    const packageName = `${scope}/${name}`
    const website = 'https://test.io'

    await cloneSource(MNP_PACKAGE, PACKAGE_PATH, {
      org,
      name,
      scope,
      packageName,
      website,
      authorName: 'test-author',
      authorEmail: 'author@test.io',
      year: '2018',
      description: 'Description of the test package',
      keywords: ['test', 'test2'],
      createDate: '25 May 2018',
      trademark: 'Art Deco',
      legalName: 'Art Deco Code Limited',
    })
    await Promise.all([
      rm(join(PACKAGE_NAME, '.documentary')),
      rm(join(PACKAGE_NAME, 'yarn.lock')),
    ])
    const s = await snapshot(PACKAGE_NAME)
    await test('cloned.txt', s.trim())
  },
}

export default T
