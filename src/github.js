const rqt = require('rqt')

async function request({
  data = {},
  token,
  org,
}) {
  const jsonData = JSON.stringify(data)
  const headers = {
    Authorization: `token ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': jsonData.length,
    'User-Agent': 'Mozilla/5.0 mnp Node.js',
  }
  const url = `https://api.github.com/${org ? `orgs/${org}` : 'user'}/repos`
  const res = await rqt(url, {
    headers,
    data: jsonData,
  })
  const parsed = JSON.parse(res)
  if (Array.isArray(parsed.errors)){
    const reduced = parsed.errors.reduce((acc, error) => {
      const errMsg = `${error.resource}: ${error.message}`
      return `${errMsg}\n${acc}`
    }, '').trim()
    throw new Error(reduced)
  } else if (parsed.message === 'Bad credentials') {
    throw new Error(parsed.message)
  }
  return parsed
}

/**
 * Create a new github repository.
 * @param {string} token github access token
 * @param {string} name Name of the new package and directory to create
 * @param {string} [org] Organisation
 * @param {string} [description] Description for github
 */
async function createRepository(token, name, org, description) {
  const res = await request({
    data: {
      description,
      name,
      auto_init: true,
      gitignore_template: 'Node',
      license_template: 'mit',
    },
    org,
    token,
  })
  return res
}

module.exports = {
  createRepository,
}
