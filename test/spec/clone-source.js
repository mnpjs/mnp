import SnapshotContext from 'snapshot-context'
import Context from '../context'
import cloneSource from '../../src/lib/clone-source'

/** @type {Object.<string, (c: Context, s: SnapshotContext)>} */
const T = {
  context: [Context, SnapshotContext],
  async 'should update references in files'({ packagePath, readDir, SNAPSHOT_DIR, MNP_PACKAGE }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const org = 'test-org'
    const name = 'test-package-10'
    const scope = '@adc'
    const packageName = `${scope}/${name}`
    const website = 'https://test.io'

    await cloneSource(MNP_PACKAGE, packagePath, {
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
    const actual = await readDir(packagePath)
    await test('expected.json', actual)
  },
}

export default T
