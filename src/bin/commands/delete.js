const GitHub = require(/* depack */'@rqt/github')
import { confirm } from 'reloquent'

const runDelete = async (token, org, name) => {
  const github = new GitHub(token)
  const y = await confirm(`Are you sure you want to delete ${org}/${name}?`, {
    defaultYes: false,
  })
  if (!y) return
  await github['repos']['delete'](org, name)
  console.log('Deleted %s/%s.', org, name)
}

export default runDelete