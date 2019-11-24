const GitHub = require(/* depack */'@rqt/github')
import { askSingle } from 'reloquent'

const runDelete = async (token, org, name) => {
  const github = new GitHub(token)
  const y = await askSingle(`Are you sure you want to delete ${org}/${name}?`)
  if (y != 'y') return
  await github['repos']['delete'](org, name)
  console.log('Deleted %s/%s.', org, name)
}

export default runDelete