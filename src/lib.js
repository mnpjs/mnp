const { createWritable, write, read } = require('wrote')
const { stat } = require('fs')
const makePromise = require('makepromise')
const spawnCommand = require('spawncommand')

async function requireConfig(path) {
    const config = await read(path)
    const parsed = JSON.parse(config)
    return parsed
}

async function cloneConfig(srcPath, destPath) {
    const defaultConfig = await read(srcPath)
    const ws = await createWritable(destPath)
    await write(ws, defaultConfig)
}

async function readConfig(configPath, defaultConfigPath) {
    try {
        const config = await requireConfig(configPath)
        return config
    } catch (err) {
        if (err.code != 'ENOENT') {
            throw err
        }
        await cloneConfig(defaultConfigPath, configPath)
        const config = await requireConfig(configPath) // should work now
        return config
    }
}

async function assertDoesNotExist(dir) {
    try {
        await makePromise(stat, dir)
        throw new Error(`directory ${dir} exists`)
    } catch (err) {
        if (!/ENOENT/.test(err.message)) {
            throw err
        }
    }
}

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

module.exports = {
    readConfig,
    assertDoesNotExist,
    git,
}
