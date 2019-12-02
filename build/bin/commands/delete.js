const GitHub = require(/* depack */'@rqt/github')
const { confirm } = require('../../../stdlib');
const { c } = require('../../../stdlib');
const { rm } = require('../../../stdlib');

const runDelete = async (token, org, name) => {
  const github = new GitHub(token)
  const n = c(`${org}/${name}`, 'yellow')
  const y = await confirm(`Are you sure you want to delete ${n}?`, {
    defaultYes: false,
  })
  if (!y) return
  await github['repos']['delete'](org, name)
  console.log('Deleted %s from GitHub.', n)

  const y2 = await confirm(`Would you like to remove ${c(name, 'yellow')} dir`, {
    defaultYes: false,
  })
  if (!y2) return
  await rm(name)
  console.log('Removed %s from the filesystem.', name)
}

module.exports=runDelete