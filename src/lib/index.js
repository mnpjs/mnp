import { resolve } from 'path'
import spawn, { fork } from 'spawncommand'
import { existsSync } from 'fs'

const error = (text) => {
  const err = new Error(text)
  err.controlled = true
  throw err
}

export const getStructure = (name = 'package') => {
  let path
  try {
    path = require(`mnp-${name}`)
  } catch (err) {
    try {
      path = require(`@mnpjs/${name}`)
    } catch (e) {
      error(`Could not require structure "${name}".`)
    }
  }
  const structure = resolve(path, 'structure')
  const { mnp: scripts = {} } = require(`${path}/package.json`)
  return {
    scripts,
    structure,
    structurePath: path,
  }
}

export const create = async (path, structurePath, script) => {
  if (Array.isArray(script)) {
    await Promise.all(script.map(s => runOnCreate(path, structurePath, s)))
  } else {
    await runOnCreate(path, structurePath, script)
  }
}

/**
 * @param {string} cwd The directory in which to execute the script.
 * @param {string} structurePath The path to the structure.
 * @param {string} script The string with a script and its arguments.
 */
export const runOnCreate = async (cwd, structurePath, script) => {
  const oc = resolve(structurePath, script)
  if (existsSync(oc)) {
    const { promise } = fork(oc, [], {
      cwd,
      stdio: 'inherit',
      execArgv: [],
    })
    await promise
  } else {
    const { promise } = spawn(script, [], {
      cwd,
      stdio: 'inherit',
    })
    await promise
  }
}