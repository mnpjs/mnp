import argufy from 'argufy'

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
export const _struct = args['struct']

/**
 * Show help.
 * @type {boolean}
 */
export const _help = args['help']

/**
 * Show MNP version.
 * @type {boolean}
 */
export const _version = args['version']

/**
 * Package name.
 * @type {string}
 */
export const _name = args['name']

/**
 * Check if taken.
 * @type {boolean}
 */
export const _check = args['check']

/**
 * Remove GitHub repository.
 * @type {boolean}
 */
export const _delete = args['delete']

/**
 * Initialise .mnprc.
 * @type {boolean}
 */
export const _init = args['init']

/**
 * Package description.
 * @type {string}
 */
export const _description = args['desc']

/**
 * Disable scope from the .mnprc.
 * @type {string}
 */
export const _noScope = args['no-scope']

/**
 * Set scope.
 * @type {string}
 */
export const _scope = args['scope']