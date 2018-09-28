import { askSingle } from 'reloquent'

const runDelete = async (github, org, name) => {
  const y = await askSingle(`Are you sure you want to delete ${org}/${name}?`)
  if (y != 'y') return
  await github.repos.delete(org, name)
  console.log('Deleted %s/%s.', org, name)
}

export default runDelete