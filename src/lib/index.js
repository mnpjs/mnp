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
    try {
      const structurePath = require(`@mnpjs/${structure}`)
      return structurePath
    } catch (e) {
      error(`Could not require structure "${structure}".`)
    }
  }
}
