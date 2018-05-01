const spawnCommand = require('spawncommand')

const assertNotInGitPath = async () => {
  const { promise } = spawnCommand('git', ['rev-parse', '--git-dir'])
  const gitRes = await promise
  if (/\.git/.test(gitRes.stdout)) {
    throw new Error('Current dir is in git path!')
  }
}

module.exports = {
  assertNotInGitPath,
}
