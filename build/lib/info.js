"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _https = require("https");

var _promto = _interopRequireDefault(require("promto"));

var _url = require("url");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const REGISTRY = 'https://skimdb.npmjs.com/registry';

const req = async address => {
  const headers = await new Promise((r, j) => {
    const opts = (0, _url.parse)(address);
    const options = {
      hostname: opts.hostname,
      port: opts.port,
      path: opts.path,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Node.js) mnp/0.7.0'
      }
    };
    (0, _https.request)(options, res => {
      r(res.statusCode);
    }).on('error', err => {
      j(err);
    }).end();
  });
  return headers;
};

var _default = async program => {
  const url = `${REGISTRY}/${program}`;
  const p = req(url);
  const status = await (0, _promto.default)(p, 5000, 'registry request timed out');
  return status == 404;
};

exports.default = _default;
//# sourceMappingURL=info.js.map