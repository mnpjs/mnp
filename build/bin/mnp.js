#!/usr/bin/env node
"use strict";

var _path = require("path");

var _wrote = require("wrote");

var _africa = _interopRequireDefault(require("africa"));

var _reloquent = require("reloquent");

var _cloneSource = _interopRequireDefault(require("../lib/clone-source"));

var _git = _interopRequireDefault(require("../lib/git"));

var _gitLib = require("../lib/git-lib");

var _github = require("../lib/github");

var _lib = require("../lib");

var _questions = _interopRequireDefault(require("./questions"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ANSWER_TIMEOUT = null;
const {
  argv
} = process;
const [,, argvPackage] = argv;
const argvPackageName = argvPackage == '-s' ? null : argvPackage;

(async () => {
  try {
    const structure = (0, _lib.findStructure)(argv);
    const {
      org,
      token,
      name,
      email,
      website,
      legalName
    } = await (0, _africa.default)('mnp', _questions.default);
    const packageName = argvPackageName ? argvPackageName : await (0, _reloquent.askQuestions)({
      packageName: {
        text: 'Package name: ',

        validation(a) {
          if (!a) throw new Error('You must specify package name');
        }

      }
    }, ANSWER_TIMEOUT, 'packageName');
    const packagePath = (0, _path.resolve)(packageName);
    await (0, _wrote.assertDoesNotExist)(packagePath);
    await (0, _gitLib.assertNotInGitPath)();
    console.log(`# ${packageName}`);
    const description = await (0, _reloquent.askQuestions)({
      description: {
        text: 'Description: ',
        postProcess: s => s.trim(),
        defaultValue: ''
      }
    }, ANSWER_TIMEOUT, 'description');
    const {
      ssh_url: sshUrl,
      git_url: gitUrl,
      html_url: htmlUrl
    } = await (0, _github.createRepository)(token, packageName, org, description);
    if (!sshUrl) throw new Error('GitHub repository was not created via API.');
    const readmeUrl = `${htmlUrl}#readme`;
    const issuesUrl = `${htmlUrl}/issues`;
    await (0, _git.default)(['clone', sshUrl, packagePath]);
    console.log('Setting user %s<%s>...', name, email);
    await Promise.all([(0, _git.default)(['config', 'user.name', name], packagePath), (0, _git.default)(['config', 'user.email', email], packagePath)]);
    await (0, _cloneSource.default)(structure, packagePath, {
      org,
      packageName,
      website,
      authorName: name,
      authorEmail: email,
      year: `${new Date().getFullYear()}`,
      issuesUrl,
      readmeUrl,
      gitUrl,
      description,
      legalName
    });
    console.log('Cloned the structure to %s', packagePath);
    console.log('Created new repository: %s', readmeUrl);
    await (0, _git.default)('add .', packagePath);
    await (0, _git.default)(['commit', '-m', 'initialise package'], packagePath);
    await (0, _git.default)('push origin master', packagePath);
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