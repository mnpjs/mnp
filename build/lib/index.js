"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStructure = void 0;

const error = text => {
  const err = new Error(text);
  err.controlled = true;
  throw err;
};

const getStructure = (structure = 'package') => {
  try {
    const structurePath = require(`mnp-${structure}`);

    return structurePath;
  } catch (err) {
    try {
      const structurePath = require(`@mnpjs/${structure}`);

      return structurePath;
    } catch (e) {
      error(`Could not require structure "${structure}".`);
    }
  }
};

exports.getStructure = getStructure;
//# sourceMappingURL=index.js.map