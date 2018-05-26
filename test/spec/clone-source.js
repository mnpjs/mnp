import { deepEqual } from 'zoroaster/assert'
import context from '../context'
import cloneSource from '../../src/lib/clone-source'
import mnpPackage from 'mnp-package'

const T = {
  context,
  async 'should update references in files'({ packagePath, readExpectedStructure, readDir }) {
    const org = 'test-org'
    const packageName = 'test-package-10'
    const website = 'https://test.io'

    await cloneSource(mnpPackage, packagePath, {
      org,
      packageName,
      website,
      authorName: 'test-author',
      authorEmail: 'author@test.io',
      year: '2018',
      description: 'Description of the test package',
      keywords: ['test', 'test2'],
      createDate: '25 May 2018',
    })
    const expected = await readExpectedStructure()
    const actual = await readDir(packagePath)
    deepEqual(expected, actual)
  },
}

export default T
