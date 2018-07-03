"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = signIn;

var _africa = _interopRequireDefault(require("africa"));

var _questions = _interopRequireDefault(require("../bin/questions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { debuglog } from 'util'
// const LOG = debuglog('mnp')
async function signIn(force = false) {
  const conf = await (0, _africa.default)('mnp', _questions.default, {
    force,
    local: true
  });
  return conf;
}
//# sourceMappingURL=sign-in.js.map