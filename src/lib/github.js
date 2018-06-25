import rqt from 'rqt'

export default async function request({
  data = {},
  token,
  org,
}) {
  const headers = {
    Authorization: `token ${token}`,
    'User-Agent': 'Mozilla/5.0 mnp Node.js',
  }
  const url = `https://api.github.com/${org ? `orgs/${org}` : 'user'}/repos`
  const res = await rqt(url, {
    headers,
    data,
  })
  if (Array.isArray(res.errors)){
    const reduced = res.errors.reduce((acc, error) => {
      const errMsg = `${error.resource}: ${error.message}`
      return `${errMsg}\n${acc}`
    }, '').trim()
    throw new Error(reduced)
  } else if (res.message == 'Bad credentials') {
    throw new Error(res.message)
  }
  return res
}

/**
 * Create a new github repository.
 * @param {string} token github access token
 * @param {string} name Name of the new package and directory to create
 * @param {string} [org] Organisation
 * @param {string} [description] Description for github
 */
export async function createRepository(token, name, org, description) {
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
