const { resolve } = require('path')

const error = (text) => {
  const err = new Error(text)
  err.controlled = true
  throw err
}

const findStructure = (argv = []) => {
  const i = argv.indexOf('-s')
  const argFound = i != -1 && i != argv.length - 1
  let structurePath
  if (!argFound) {
    structurePath = resolve(__dirname, '../structures/my-new-package')
  } else {
    const arg = argv[i + 1]
    const moduleName = `mnp-${arg}`
    try {
      structurePath = require(moduleName) // structures must export a string
    } catch (err) {
      error(`Could not require structure "${arg}".`)
    }
  }
  return `${structurePath}/`
}

module.exports = {
  findStructure,
}
