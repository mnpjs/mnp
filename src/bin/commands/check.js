import info from '../../lib/info'
import { c } from 'erte'
import indicatrix from 'indicatrix'

const runCheck = async (name) => {
  const found = await indicatrix(`Checking package ${c(name, 'yellow')}`, info(name))
  console.log(
    'Package named %s is %s.',
    !found ? c(name, 'green') : c(name, 'red'),
    !found ? 'available' : 'taken'
  )
  if (found) {
    console.log(found['description'])
    found['homepage'] && console.log(found['homepage'])
  }
}

export default runCheck