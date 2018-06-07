"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const u1 = `
+ package:\ta Node.js package to publish on npm (default)
+ idio:\t\ta Koa2+React universal website
+ structure:\tan mnp template`.trim();
const u = {
  'package-name': 'Name of the new package.',
  '-s structure': 'Which tructure to use (package, idio, structure).',
  '-h, --help': 'Print this information and quit.'
};
const commands = Object.keys(u);
const descriptions = Object.values(u);

var _default = () => {
  const [commandLength] = commands.reduce(([longestName = 0, longestDescription = 0], name) => {
    /** @type {string} */
    const command = u[name];
    const theLongest = command.split('\n').reduce((acc, c) => {
      if (c.length > acc) return c.length;
      return acc;
    }, 0);
    if (theLongest > longestDescription) longestDescription = theLongest;
    if (name.length > longestName) longestName = name.length;
    return [longestName, longestDescription];
  }, []);

  const pad = (string, length) => {
    const l = length - string.length;
    const t = Array.from({
      length: l
    });
    const ts = t.map(_ => ' ').join(''); // eslint-disable-line no-unused-vars

    const s = `${string}${ts}`;
    return s;
  };

  const usa = commands.reduce((acc, command, i) => {
    const value = descriptions[i];
    const vals = value.split('\n');
    const c = pad(command, commandLength);
    const [firstVal, ...otherVals] = vals;
    const firstLine = `${c}\t${firstVal}`;
    const emptyPad = pad('', commandLength);
    const otherLines = otherVals.map(val => {
      const r = `${emptyPad}\t${val}`;
      return r;
    });
    const res = [...acc, firstLine, ...otherLines];
    return res;
  }, []);
  const USA = usa.map(a => `\t${a}`);
  const usage = `MNP: create My New Package.
If no arguments are given, the program will ask for the package name in the CLI.
A github repository for each new package will be created automatically,
therefore a GitHub token can be generated at: https://github.com/settings/tokens
for the use in this application. The token is saved in ~/.mnprc along with other
configuration, including organisation name etc. Different types of packages,
with a Node.js library shell by default are available, including:

${u1}

  mnp [package-name] [-s (idio|structure)]\n
${USA.join('\n')}

Example:

  mnp my-new-package -s idio
`;
  return usage;
};

exports.default = _default;
//# sourceMappingURL=usage.js.map