let africa = require('africa'); if (africa && africa.__esModule) africa = africa.default;
// import { debuglog } from 'util'
let questions = require('../bin/questions'); if (questions && questions.__esModule) questions = questions.default;

// const LOG = debuglog('mnp')

               async function signIn(force = false) {
  const conf = await africa('mnp', questions, {
    force,
    local: true,
  })
  return conf
}


module.exports = signIn
//# sourceMappingURL=sign-in.js.map