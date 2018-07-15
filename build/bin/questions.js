"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _git = _interopRequireDefault(require("../lib/git"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  token: {
    text: 'GitHub access token',
    validation: a => {
      if (!a) {
        throw new Error('Please specify token.');
      }
    }
  },
  org: {
    text: 'GitHub organisation',
    defaultValue: null
  },
  scope: {
    text: 'npm scope',

    postProcess(v) {
      if (!v) return v;
      return v.replace(/^@/, '');
    },

    defaultValue: null
  },
  name: {
    async getDefault() {
      const {
        stdout
      } = await (0, _git.default)('config user.name', null, true);
      return stdout.trim();
    },

    text: 'user'
  },
  email: {
    async getDefault() {
      const {
        stdout
      } = await (0, _git.default)('config user.email', null, true);
      return stdout.trim();
    },

    text: 'email'
  },
  website: {
    text: 'Website (for readme)',
    defaultValue: null
  },
  trademark: {
    text: 'Trademark (for readme)',
    defaultValue: null
  },
  legalName: {
    text: 'Legal name (for license)',
    defaultValue: null
  }
};
exports.default = _default;
//# sourceMappingURL=questions.js.map