"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.create = exports.getStructure = void 0;

var _path = require("path");

var _spawncommand = _interopRequireWildcard(require("spawncommand"));

var _fs = require("fs");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const error = text => {
  const err = new Error(text);
  err.controlled = true;
  throw err;
};

const getStructure = (name = 'package') => {
  let path;

  try {
    path = require(`mnp-${name}`);
  } catch (err) {
    try {
      path = require(`@mnpjs/${name}`);
    } catch (e) {
      error(`Could not require structure "${name}".`);
    }
  }

  const structure = (0, _path.resolve)(path, 'structure');

  const {
    mnp: scripts = {}
  } = require(`${path}/package.json`);

  return {
    scripts,
    structure,
    structurePath: path
  };
};

exports.getStructure = getStructure;

const create = async (path, structurePath, script) => {
  if (Array.isArray(script)) {
    await Promise.all(script.map(s => runOnCreate(path, structurePath, s)));
  } else {
    await runOnCreate(path, structurePath, script);
  }
};

exports.create = create;

const runOnCreate = async (path, structurePath, script) => {
  const oc = (0, _path.resolve)(structurePath, script);

  if ((0, _fs.existsSync)(oc)) {
    await (0, _spawncommand.fork)(oc, [], {
      cwd: path,
      stdio: 'inherit',
      execArgv: []
    });
  } else {
    await (0, _spawncommand.default)(script, [], {
      cwd: path,
      stdio: 'inherit'
    });
  }
};
//# sourceMappingURL=index.js.map