let africa = require('africa'); if (africa && africa.__esModule) africa = africa.default;
let questions = require('../bin/questions'); if (questions && questions.__esModule) questions = questions.default;

               async function signIn(force = false) {
  /** @type {Settings} */
  const conf = await africa('mnp', questions, {
    force,
    local: true,
  })
  return conf
}

/** @typedef {{token: string, org: string, scope: string, name: string, email: string, website: string, trademark: string, legalName: string }} Settings */

module.exports = signIn