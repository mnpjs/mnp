let argufy = require('argufy'); if (argufy && argufy.__esModule) argufy = argufy.default;

const args = argufy({
  'struct': 's',
  'help': { short: 'h', boolean: true },
  'desc': { short: 'D' },
  'name': { command: true },
  'version': { short: 'v', boolean: true },
  'check': { short: 'c', boolean: true },
  'delete': { short: 'd', boolean: true },
  'init': { short: 'I', boolean: true },
  'no-scope': { short: 'n', boolean: true },
  'scope': { short: '@' },
})

/**
 * The structure.
 * @type {string}
 */
       const _struct = args['struct']

/**
 * Show help.
 * @type {boolean}
 */
       const _help = args['help']

/**
 * Show MNP version.
 * @type {boolean}
 */
       const _version = args['version']

/**
 * Package name.
 * @type {string}
 */
       const _name = args['name']

/**
 * Check if taken.
 * @type {boolean}
 */
       const _check = args['check']

/**
 * Remove GitHub repository.
 * @type {boolean}
 */
       const _delete = args['delete']

/**
 * Initialise .mnprc.
 * @type {boolean}
 */
       const _init = args['init']

/**
 * Package description.
 * @type {string}
 */
       const _description = args['desc']

/**
 * Disable scope from the .mnprc.
 * @type {string}
 */
       const _noScope = args['no-scope']

/**
 * Set scope.
 * @type {string}
 */
       const _scope = args['scope']

module.exports._struct = _struct
module.exports._help = _help
module.exports._version = _version
module.exports._name = _name
module.exports._check = _check
module.exports._delete = _delete
module.exports._init = _init
module.exports._description = _description
module.exports._noScope = _noScope
module.exports._scope = _scope