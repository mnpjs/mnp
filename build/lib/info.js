const { request } = require('https');
let promto = require('promto'); if (promto && promto.__esModule) promto = promto.default;
const { parse } = require('url');

const REGISTRY = 'https://skimdb.npmjs.com/registry'

const req = async (address) => {
  const headers = await new Promise((r, j) => {
    const opts = parse(address)
    const options = {
      hostname: opts.hostname,
      port: opts.port,
      path: opts.path,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Node.js) mnp/0.7.0',
      },
    }
    request(options, (res) => {
      r(res.statusCode)
    })
      .on('error', (err) => {
        j(err)
      })
      .end()
  })
  return headers
}
module.exports=async (program) => {
  const url = `${REGISTRY}/${program}`
  const p = req(url)
  const status = await promto(p, 5000, 'registry request timed out')
  return status == 404
}

//# sourceMappingURL=info.js.map