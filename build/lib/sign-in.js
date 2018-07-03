"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = signIn;

var _africa = _interopRequireDefault(require("africa"));

var _bosom = _interopRequireDefault(require("bosom"));

var _questions = _interopRequireDefault(require("../bin/questions"));

var _os = require("os");

var _path = require("path");

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG = (0, _util.debuglog)('mnp');

async function signIn(local = false, force = false) {
  let r;

  if (local) {
    try {
      r = await (0, _bosom.default)((0, _path.resolve)((0, _os.homedir)(), '.mnprc'));
    } catch (er) {
      LOG('Could not read the global rc file.');
    }
  } //


  debugger;
  const c = { ...(local ? {
      homedir: '.'
    } : {}),
    ...(force ? {
      force
    } : {})
  };
  const q = r ? Object.keys(_questions.default).reduce((a, k) => {
    const v = _questions.default[k];
    const o = { ...a,
      [k]: { ...v,
        defaultValue: r[k]
      }
    };
    return o;
  }, {}) : _questions.default;
  debugger;
  const conf = await (0, _africa.default)('mnp', q, c);
  return conf;
}
//# sourceMappingURL=sign-in.js.map