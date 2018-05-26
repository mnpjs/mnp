"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findStructure = void 0;

const error = text => {
  const err = new Error(text);
  err.controlled = true;
  throw err;
};

const findStructure = (argv = []) => {
  const i = argv.indexOf('-s');
  const argFound = i > -1;

  if (argFound && i == argv.length - 1) {
    throw new Error('Please pass the structure name');
  }

  const argValueFound = argFound && i != argv.length - 1;
  let structurePath;

  if (!argValueFound) {
    structurePath = require('mnp-package');
  } else {
    const arg = argv[i + 1];
    const moduleName = `mnp-${arg}`;

    try {
      structurePath = require(moduleName); // structures must export a string
    } catch (err) {
      error(`Could not require structure "${arg}".`);
    }
  }

  return `${structurePath}/`;
};

exports.findStructure = findStructure;
//# sourceMappingURL=index.js.map