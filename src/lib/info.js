import spawn from 'spawncommand'

export default async ({ program, field } = {}) => {
  const args = ['info', program, '--json']
  const { promise } = spawn('yarn', args)
  const { stdout } = await promise
  const { data } = JSON.parse(stdout)
  if (field) {
    return data[field]
  }
  return data
}
