const { promto } = require('../../stdlib');
const { aqt } = require('../../stdlib');

const REGISTRY = 'https://skimdb.npmjs.com/registry'

const req = async (address) => {
  const { statusCode, body } = await aqt(address, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Node.js, mnp)',
    },
  })
  return { statusCode, body }
}
module.exports=async (program) => {
  const url = `${REGISTRY}/${program}`
  const p = req(url)
  const { statusCode, body } = await promto(p, 5000, 'Registry request timed out.')
  return statusCode == 404 ? null : body
}