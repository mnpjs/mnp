const spawnCommand = require('spawncommand')

/**
 *
 * @param {string[]} args arguments to pass to git executable
 * @param {string} [cwd] working directory
 * @param {boolean} [noPipe=false] whether not to print to stdout and stderr
 */
async function git(args, cwd, noPipe = false) {
  const proc = spawnCommand('git', args, cwd ? { cwd } : {})
  if (!noPipe) {
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
  }
  const res = await proc.promise
  return res
}

module.exports = git
