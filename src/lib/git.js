import spawn from 'spawncommand'

/**
 * Run a git command.
 * @param {string|string[]} args arguments to pass to git executable
 * @param {string} [cwd] working directory
 * @param {boolean} [noPipe=false] whether not to print to stdout and stderr
 */
async function git(args, cwd, noPipe = false) {
  let a
  if (Array.isArray(args)) {
    a = args
  } else if (typeof args == 'string') {
    a = args.split(' ')
  }
  const { promise, stdout, stderr } = spawn('git', a, cwd ? { cwd } : {})
  if (!noPipe) {
    stdout.pipe(process.stdout)
    stderr.pipe(process.stderr)
  }
  const res = await promise
  return res
}

module.exports = git
