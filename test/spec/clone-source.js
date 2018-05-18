import { deepEqual } from 'zoroaster/assert'
import { resolve } from 'path'
import context from '../context'
import cloneSource from '../../src/clone-source'

const structure = resolve(__dirname, '../../structures/my-new-package/')

const cloneSourceTestSuite = {
  context,
  async 'should update references in files'({ packagePath, readExpectedStructure, readDir }) {
    const org = 'test-org'
    const packageName = 'test-package-10'
    const website = 'https://test.io'

    await cloneSource(structure, packagePath, {
      org,
      packageName,
      website,
      authorName: 'test-author',
      authorEmail: 'author@test.io',
      year: '2017',
      description: 'Description of the test package',
      keywords: ['test', 'test2'],
      createDate: '22 May 2017',
    })
    const expected = await readExpectedStructure()
    const actual = await readDir(packagePath)
    deepEqual(expected, actual)
  },
}
