let spawn = require('spawncommand'); if (spawn && spawn.__esModule) spawn = spawn.default;

const assertNotInGitPath = async () => {
  const { promise } = spawn('git', ['rev-parse', '--git-dir'])
  const gitRes = await promise
  if (/\.git/.test(gitRes.stdout)) {
    throw new Error('Current dir is in git path!')
  }
}



module.exports.assertNotInGitPath = assertNotInGitPath