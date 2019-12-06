const { usually } = require('../../stdlib');
const { argsConfig } = require('./get-args');
const { reduceUsage } = require('../../stdlib');
const { c } = require('../../stdlib');

// + idio:\t\ta back-end server powered by Goa;
// + structure:\tan mnp template to create new structures.`.trim()

module.exports=() => {
  const u = usually({
    usage: reduceUsage(argsConfig),
    line: 'mnp [name] [-t template] [-D description] [-@ scope|-n] [-pcId] [-hv]',
    description: `MNP: create My New Package.
 If no package name is given as the first argument, the program will ask
 for it in the CLI. A GitHub repository for each new package will be
 created automatically, and a GitHub token can be generated at:
 https://github.com/settings/tokens for the use in this application.
 The token is saved in the CWD/.mnprc file along with other configuration,
 including organisation name etc. Different types of packages, with a
 modern Node.JS library by default are available, including:

${u1}`,
    example: 'mnp my-new-package -t org/template',
  })
  return u
}

const u1 = `${c('package', 'magenta')}:\ta modern Node.JS package to publish on npm (default)
\t\thttps://github.com/mnpjs/package
${c('splendid', 'green')}:\ta static website using Splendid
\t\thttps://github.com/mnpjs/splendid`
