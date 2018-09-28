import info from '../../lib/info'
import { c } from 'erte'

const runCheck = async (name) => {
  console.log('Checking package %s...', name)
  const found = await info(name)
  console.log(
    'Package named %s is %s.',
    !found ? c(name, 'green') : c(name, 'red'),
    !found ? 'available' : 'taken'
  )
  if (found) {
    console.log(found.description)
    found.homepage && console.log(found.homepage)
  }
}

export default runCheck