"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertNotInGitPath = void 0;

var _spawncommand = _interopRequireDefault(require("spawncommand"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const assertNotInGitPath = async () => {
  const {
    promise
  } = (0, _spawncommand.default)('git', ['rev-parse', '--git-dir']);
  const gitRes = await promise;

  if (/\.git/.test(gitRes.stdout)) {
    throw new Error('Current dir is in git path!');
  }
};

exports.assertNotInGitPath = assertNotInGitPath;