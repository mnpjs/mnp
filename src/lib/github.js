import rqt from 'rqt'

export default async function request({
  data,
  token,
  org,
  method,
  u,
}) {
  const h = {
    Authorization: `token ${token}`,
    'User-Agent': 'Mozilla/5.0 mnp Node.js',
  }
  const url = `https://api.github.com/${org ? `orgs/${org}` : 'user'}/${u}`
  const { body, headers } = await rqt(url, {
    headers: h,
    data,
    method,
    returnHeaders: true,
  })
  if (Array.isArray(body.errors)){
    const reduced = body.errors.reduce((acc, error) => {
      const errMsg = `${error.resource}: ${error.message}`
      return `${errMsg}\n${acc}`
    }, '').trim()
    throw new Error(reduced)
  } else if (body.message == 'Bad credentials') {
    throw new Error(body.message)
  }
  return { body, headers }
}

/**
 * Create a new github repository.
 * @param {string} token github access token
 * @param {string} name Name of the new package and directory to create
 * @param {string} [org] Organisation
 * @param {string} [description] Description for github
 */
export async function createRepository(token, name, org, description) {
  const { body } = await request({
    data: {
      description,
      name,
      auto_init: true,
      gitignore_template: 'Node',
      license_template: 'mit',
    },
    org,
    token,
    u: 'repos',
  })
  return body
}

export async function starRepository(token, name, org) {
  const { headers } = await request({
    token,
    u: `starred/${org}/${name}`,
    method: 'PUT',
    data: {},
  })
  if (headers.status != '204 No Content') {
    console.log('Could not star the %s/%s repository', org, name)
  }
}
