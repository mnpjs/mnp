const { africa } = require('../../stdlib');
const questions = require('../bin/questions');

/**
 * Reads the mnprc config file from the file system.
 */
async function signIn(force = false) {
  const conf = /** @type {_mnp.Settings} */ (await africa('mnp', questions, {
    force,
    local: true,
  }))
  return conf
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('../..').Settings} _mnp.Settings
 */

module.exports = signIn