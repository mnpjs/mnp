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

const runOnCreate = async (path, structurePath, script) => {
  const oc = resolve(structurePath, script)
  if (existsSync(oc)) {
    await fork(oc, [], {
      cwd: path,
      stdio: 'inherit',
      execArgv: [],
    })
  } else {
    await spawn(script, [], {
      cwd: path,
      stdio: 'inherit',
    })
  }
}