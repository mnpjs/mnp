import { join } from 'path'
import Context from '../context'
import TempContext from '../context/temp'
import cloneSource from '../../src/lib/clone-source'

/** @type {Object.<string, (c: Context, t: TempContext)>} */
const T = {
  context: [Context, TempContext],
  async 'updates references in files'(
    { MNP_PACKAGE },
    { PACKAGE_NAME, PACKAGE_PATH, snapshot, rm },
  ) {
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
      year: '2019',
      description: 'Description of the test package',
      keywords: ['test', 'test2'],
      createDate: '30 March 2019',
      trademark: 'MNP JS',
      legalName: 'Art Deco Code Limited',
    })
    await Promise.all([
      rm(join(PACKAGE_NAME, '.documentary')),
      rm(join(PACKAGE_NAME, 'yarn.lock')),
    ])
    const s = await snapshot(PACKAGE_NAME)
    return s
  },
}

export default T