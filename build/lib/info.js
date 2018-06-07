"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _spawncommand = _interopRequireDefault(require("spawncommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = async ({
  program,
  field
} = {}) => {
  const args = ['info', program, '--json'];
  const {
    promise
  } = (0, _spawncommand.default)('yarn', args);
  const {
    stdout
  } = await promise;
  const {
    data
  } = JSON.parse(stdout);

  if (field) {
    return data[field];
  }

  return data;
};

exports.default = _default;
//# sourceMappingURL=info.js.map