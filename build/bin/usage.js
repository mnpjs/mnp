"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _usually = _interopRequireDefault(require("usually"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const u1 = `
+ package:\ta Node.js package to publish on npm (default)
+ idio:\t\ta Koa2+React universal website
+ structure:\tan mnp template`.trim();
const usage = {
  'package-name': 'Name of the new package.',
  '-s structure': 'Which structure to use (package, idio, structure).',
  '-h, --help': 'Print this information and quit.',
  '-d, --delete': 'Delete a repository.',
  '-I, --init': 'Initialise configuration in HOMEDIR/.mnprc.'
};

var _default = () => {
  const u = (0, _usually.default)({
    usage,
    line: 'mnp [package-name] [-s (idio|structure)] [-d repo_name] -hI',
    description: `MNP: create My New Package.
If no arguments are given, the program will ask for the package name in the CLI.
A github repository for each new package will be created automatically,
therefore a GitHub token can be generated at: https://github.com/settings/tokens
for the use in this application. The token is saved in ~/.mnprc along with other
configuration, including organisation name etc. Different types of packages,
with a Node.js library shell by default are available, including:

${u1}`,
    example: 'mnp my-new-package -s idio'
  });
  return u;
};

exports.default = _default;
//# sourceMappingURL=usage.js.map