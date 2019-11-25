const { usually } = require('../../stdlib');
const { argsConfig } = require('./get-args');
const { reduceUsage } = require('../../stdlib');

const u1 = `
+ package:\ta modern Node.js package to publish on npm (default);
+ idio:\t\ta back-end server powered by Goa;
+ splendid:\ta static website using Splendid;
+ structure:\tan mnp template to create new structures.`.trim()

module.exports=() => {
  const u = usually({
    usage: reduceUsage(argsConfig),
    line: 'mnp [package-name] [-D description] [-s structure] [-cIhdv]',
    description: `MNP: create My New Package.
 If no package name is given as the first argument, the program will ask
 for it in the CLI. A GitHub repository for each new package will be
 created automatically, and a GitHub token can be generated at:
 https://github.com/settings/tokens for the use in this application.
 The token is saved in the CWD/.mnprc file along with other configuration,
 including organisation name etc. Different types of packages, with a
 modern Node.js library by default are available, including:

${u1}`,
    example: 'mnp my-new-package -s idio',
  })
  return u
}
