let spawn = require('spawncommand'); if (spawn && spawn.__esModule) spawn = spawn.default;

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
  } else if (noPipe == 'dots') {
    stdout.on('data', () => {
      process.stdout.write('.')
    })
    stderr.on('data', () => {
      process.stdout.write('.')
    })
  }
  const res = await promise
  if (noPipe == 'dots') process.stdout.write('\n')
  if (/ERROR/.test(res.stderr)) throw new Error(res.stderr)
  return res
}

module.exports=git

//# sourceMappingURL=git.js.map