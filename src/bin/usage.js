import usually from 'usually'

const u1 = `
+ package:\ta modern Node.js package to publish on npm (default);
+ idio:\t\ta JSX-powered Koa2 + React-Redux universal website;
+ structure:\tan mnp template to create new structures.`.trim()

const usage = {
  'package-name': 'Name of the new or checked package.',
  '-s structure': 'Which structure to use (package, idio, structure).',
  '-c, --check': 'Check if the package name has been taken or not.',
  '-l, --local': 'Read and write local .mnprc in the current working directory.',
  '-h, --help': 'Print this information and quit.',
  '-d repo': 'Delete a repository. Useful in testing.',
  '--init, -I': 'Initialise configuration in HOMEDIR/.mnprc.',
}

export default () => {
  const u = usually({
    usage,
    line: 'mnp [package-name] [-c] [-s (idio|structure)] [-d repo_name] -hI',
    description: `MNP: create My New Package.
 If no package name is given as the first argument, the program will ask
 for it in the CLI. A GitHub repository for each new package will be
 created automatically, and a GitHub token can be generated at:
 https://github.com/settings/tokens for the use in this application.
 The token is saved in HOMEDIR/.mnprc along with other configuration,
 including organisation name etc. Different types of packages, with a
 modern Node.js library by default are available, including:

${u1}`,
    example: 'mnp my-new-package -s idio',
  })
  return u
}
