const error = (text) => {
  const err = new Error(text)
  err.controlled = true
  throw err
}

export const getStructure = (structure = 'package') => {
  try {
    const structurePath = require(`mnp-${structure}`)
    return structurePath
  } catch (err) {
    error(`Could not require structure "${structure}".`)
  }
}
