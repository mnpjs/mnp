#!/usr/bin/env node
"use strict";

var _path = require("path");

var _wrote = require("wrote");

var _reloquent = require("reloquent");

var _argufy = _interopRequireDefault(require("argufy"));

var _erte = require("erte");

var _usage = _interopRequireDefault(require("./usage"));

var _cloneSource = _interopRequireDefault(require("../lib/clone-source"));

var _git = _interopRequireDefault(require("../lib/git"));

var _gitLib = require("../lib/git-lib");

var _github = require("../lib/github");

var _lib = require("../lib");

var _info = _interopRequireDefault(require("../lib/info"));

var _signIn = _interopRequireDefault(require("../lib/sign-in"));

var _package = require("../../package.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  struct,
  help,
  name: _name,
  check,
  delete: _delete,
  init,
  desc: _description,
  version: _version
} = (0, _argufy.default)({
  struct: 's',
  help: {
    short: 'h',
    boolean: true
  },
  desc: {
    short: 'D'
  },
  name: {
    command: true
  },
  version: {
    short: 'v',
    boolean: true
  },
  check: {
    short: 'c',
    boolean: true
  },
  delete: {
    short: 'd',
    boolean: true
  },
  init: {
    short: 'I',
    boolean: true
  }
});

if (_version) {
  console.log(_package.version);
  process.exit();
}

const ANSWER_TIMEOUT = null;

const makeGitLinks = (org, name) => ({
  ssh_url: `git://github.com/${org}/${name}.git`,
  git_url: 123,
  html_url: `https://github.com/${org}/${name}#readme`
});

if (help) {
  const u = (0, _usage.default)();
  console.log(u);
  process.exit();
}

const getPackageNameWithScope = (packageName, scope) => {
  return `${scope ? `@${scope}/` : ''}${packageName}`;
};

(async () => {
  try {
    if (init) {
      await (0, _signIn.default)(true);
      return;
    }

    const name = _name || (await (0, _reloquent.askSingle)({
      text: 'Package name',

      validation(a) {
        if (!a) throw new Error('You must specify the package name.');
      }

    }, ANSWER_TIMEOUT));

    if (check) {
      console.log('Checking package %s...', name);
      const available = await (0, _info.default)(name);
      console.log('Package named %s is %s.', available ? (0, _erte.c)(name, 'green') : (0, _erte.c)(name, 'red'), available ? 'available' : 'taken');
      return;
    }

    const {
      structure,
      scripts,
      structurePath
    } = (0, _lib.getStructure)(struct);
    const {
      onCreate
    } = scripts;
    const {
      org,
      token,
      name: userName,
      email,
      website,
      legalName,
      trademark,
      scope
    } = await (0, _signIn.default)();
    const packageName = getPackageNameWithScope(name, scope);

    if (_delete) {
      const y = await (0, _reloquent.askSingle)(`Are you sure you want to delete ${packageName}?`);
      if (y != 'y') return;
      await (0, _github.deleteRepository)(token, name, org);
      console.log('Deleted %s/%s.', org, name);
      return;
    }

    const path = (0, _path.resolve)(name);
    await (0, _wrote.assertDoesNotExist)(path);
    await (0, _gitLib.assertNotInGitPath)();
    console.log(`# ${packageName}`);
    const description = _description || (await (0, _reloquent.askSingle)({
      text: 'Description',
      postProcess: s => s.trim(),
      defaultValue: ''
    }, ANSWER_TIMEOUT));
    const {
      ssh_url: sshUrl,
      git_url: gitUrl,
      html_url: htmlUrl
    } = await (0, _github.createRepository)(token, name, org, description);
    if (!sshUrl) throw new Error('GitHub repository was not created via API.');
    await (0, _github.starRepository)(token, name, org);
    console.log('%s\n%s', (0, _erte.c)('Created and starred a new repository', 'grey'), (0, _erte.b)(htmlUrl, 'green'));
    const readmeUrl = `${htmlUrl}#readme`;
    const issuesUrl = `${htmlUrl}/issues`;
    await (0, _git.default)(['clone', sshUrl, path]);
    console.log('Setting user %s<%s>...', userName, email);
    await (0, _git.default)(['config', 'user.name', userName], path);
    await (0, _git.default)(['config', 'user.email', email], path);
    await (0, _cloneSource.default)(structure, path, {
      org,
      name,
      scope,
      packageName,
      website,
      authorName: userName,
      authorEmail: email,
      issuesUrl,
      readmeUrl,
      gitUrl,
      description,
      legalName,
      trademark
    });
    await (0, _git.default)('add .', path, true);
    await (0, _git.default)(['commit', '-m', 'initialise package'], path, true);
    console.log('Initialised package structure, pushing.');
    await (0, _git.default)('push origin master', path, true);

    if (onCreate) {
      await (0, _lib.create)(path, structurePath, onCreate);
    }

    console.log('Created a new package: %s.', (0, _erte.c)(packageName, 'green'));
  } catch ({
    controlled,
    message,
    stack
  }) {
    if (controlled) {
      console.error(message);
    } else {
      console.error(stack);
    }

    process.exit(1);
  }
})();
//# sourceMappingURL=index.js.map