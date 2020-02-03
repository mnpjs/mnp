import { spawn2 } from './'

export const assertNotInGitPath = async () => {
  const { promise } = spawn2('git', ['rev-parse', '--git-dir'])
  const gitRes = await promise
  if (/\.git/.test(gitRes.stdout)) {
    throw new Error('Current dir is in git path!')
  }
}

