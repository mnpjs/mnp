"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _usually = _interopRequireDefault(require("usually"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const u1 = `
+ package:\ta modern Node.js package to publish on npm (default);
+ idio:\t\ta JSX-powered Koa2 + React-Redux universal website;
+ structure:\tan mnp template to create new structures.`.trim();
const usage = {
  'package-name': 'Name of the new or checked package.',
  '-D, --desc': 'Description of the software.',
  '-s structure': 'Which structure to use (package, idio, structure).',
  '-c, --check': 'Check if the package name has been taken or not.',
  '-h, --help': 'Print this information and quit.',
  '-d, --delete': 'Delete a repository. Useful in testing.',
  '-v, --version': 'Show mnp version.',
  '--init, -I': 'Initialise configuration in the local .mnprc file.'
};

var _default = () => {
  const u = (0, _usually.default)({
    usage,
    line: 'mnp [package-name] [-D description] [-s structure] [-cIhdv]',
    description: `MNP: create My New Package.
 If no package name is given as the first argument, the program will ask
 for it in the CLI. A GitHub repository for each new package will be
 created automatically, and a GitHub token can be generated at:
 https://github.com/settings/tokens for the use in this application.
 The token is saved in the CWD/.mnprc file along with other configuration,
 including organisation name etc. Different types of packages, with a
 modern Node.js library by default are available, including:

${u1}`,
    example: 'mnp my-new-package -s idio'
  });
  return u;
};

exports.default = _default;
//# sourceMappingURL=usage.js.map