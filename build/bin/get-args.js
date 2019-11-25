const { argufy } = require('../../stdlib');

const argsConfig = {
  'name': {
    description: 'The name of the new package.',
    command: true,
  },
  'struct': {
    description: 'The structure to invoke.',
    short: 's',
  },
  'desc': {
    description: 'The description to add.',
    short: 'D',
  },
  'check': {
    description: 'Just query NPM registry to see if the package exists.',
    boolean: true,
    short: 'c',
  },
  'delete': {
    description: 'Remove the repository from GitHub.',
    boolean: true,
    short: 'd',
  },
  'init': {
    description: 'Initialise MNP config in this directory, creating .mnprc.',
    boolean: true,
    short: 'I',
  },
  'no-scope': {
    description: 'Don\'t use a scope for this package.',
    boolean: true,
    short: 'n',
  },
  'scope': {
    description: 'Use this specific scope for the package.',
    short: '@',
  },
  'help': {
    description: 'Print the help information and exit.',
    boolean: true,
    short: 'h',
  },
  'version': {
    description: 'Show the version\'s number and exit.',
    boolean: true,
    short: 'v',
  },
}
const args = argufy(argsConfig)

/**
 * The name of the new package.
 */
const _name = /** @type {string} */ (args['name'])

/**
 * The structure to invoke.
 */
const _struct = /** @type {string} */ (args['struct'])

/**
 * The description to add.
 */
const _desc = /** @type {string} */ (args['desc'])

/**
 * Just query NPM registry to see if the package exists.
 */
const _check = /** @type {boolean} */ (args['check'])

/**
 * Remove the repository from GitHub.
 */
const _delete = /** @type {boolean} */ (args['delete'])

/**
 * Initialise MNP config in this directory, creating .mnprc.
 */
const _init = /** @type {boolean} */ (args['init'])

/**
 * Don't use a scope for this package.
 */
const _noScope = /** @type {boolean} */ (args['no-scope'])

/**
 * Use this specific scope for the package.
 */
const _scope = /** @type {string} */ (args['scope'])

/**
 * Print the help information and exit.
 */
const _help = /** @type {boolean} */ (args['help'])

/**
 * Show the version's number and exit.
 */
const _version = /** @type {boolean} */ (args['version'])

/**
 * The additional arguments passed to the program.
 */
const _argv = /** @type {!Array<string>} */ (args._argv)

module.exports.argsConfig = argsConfig
module.exports._name = _name
module.exports._struct = _struct
module.exports._desc = _desc
module.exports._check = _check
module.exports._delete = _delete
module.exports._init = _init
module.exports._noScope = _noScope
module.exports._scope = _scope
module.exports._help = _help
module.exports._version = _version
module.exports._argv = _argv