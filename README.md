# mnp

[![npm version](https://badge.fury.io/js/mnp.svg)](https://npmjs.org/package/mnp)

`mnp` aka _My New Package_ is a global npm package which allows to quickly create a new _Node.js_ package with a default structure (`src`, `test`, `package.json`, _etc_) and initialise a _GitHub_ repository.

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [CLI: `mnp my-new-package`](#cli-mnp-my-new-package)
  * [`-h, --help`: Show Help](#-h---help-show-help)
  * [`-c`: Check Exists](#-c-check-exists)
  * [Config](#config)
  * [Create a Package](#create-a-package)
- [Structures](#structures)
  * [`An Art Deco Node.js Package`](#an-art-deco-nodejs-package)
  * [Universal Koa Website](#universal-koa-website)
- [`Package` Structure](#package-structure)
  * [Main Function](#main-function)
  * [Test Suites](#test-suites)
    * [_snapshot-testing_](#_snapshot-testing_)
  * [Testing Context](#testing-context)
  * [Documentation with `doc`](#documentation-with-doc)
  * [Scripts in `Package.json`](#scripts-in-packagejson)
    * [build with _bestie_](#build-with-_bestie_)
    * [document with _documentary_](#document-with-_documentary_)
    * [test with _zoroaster_](#test-with-_zoroaster_)
  * [`.babelrc` Transforms](#babelrc-transforms)
  * [`launch.json` Debugging](#launchjson-debugging)
- [todo](#todo)



## CLI: `mnp my-new-package`

The default mode is to start creating a package. If `package-name` is not passed, the program will run in interactive mode and ask to enter details.

```sh
mnp
```

```fs
Please give package name: mynewpackage
# mynewpackage
Description: example-package
Cloning into './mynewpackage'...
Setting user Author<author@testt.cc>...
Cloned the structure to /mynewpackage
Created new repository: https://github.com/org/mynewpackage#readme
```

### `-h, --help`: Show Help

```
MNP: create My New Package.
If no arguments are given, the program will ask for the package name in the CLI.
A github repository for each new package will be created automatically,
therefore a GitHub token can be generated at: https://github.com/settings/tokens
for the use in this application. The token is saved in ~/.mnprc along with other
configuration, including organisation name etc. Different types of packages,
with a Node.js library shell by default are available, including:

+ package:	a Node.js package to publish on npm (default)
+ idio:		a Koa2+React universal website
+ structure:	an mnp template

  mnp [package-name] [-s (idio|structure)]

	package-name	Name of the new package.
	-s structure	Which structure to use (package, idio, structure).
	-h, --help  	Print this information and quit.

  Example:

    mnp my-new-package -s idio
```

### `-c`: Check Exists

Check if the package name is already taken or not.

```sh
mnp -c taken
```

![taken output](doc/taken.png)

```sh
mnp -c isfree
```

![free output](doc/free.png)

### Config

When launched for the first time, you will be asked to complete the set-up process. You will need a [GitHub token][1]. Organisation name is optional, if supplied repositories will be created for it. `name` and `email` will be used in `package.json` and in local git config. `website` is the link in the readme. `legal name` is what goes in _LICENCE_ and also in readme as the website name if organisation name is not given.

![configuration process](https://sobes.s3.eu-west-2.amazonaws.com/mnp-config2.gif)

### Create a Package

To use the module, enter `mnp cool-package-name`, or just `mnp` to be asked for the name. `mnp` will check if directory does not exist and not in a git path, create a `Github` repository, clone it to local filesystem, and fill in the default _Node.js_ package structure.

![creation process](https://sobes.s3.eu-west-2.amazonaws.com/mnp-make.gif)

```bash
cd ~/Packages
mnp my-example-package # scaffold your new app
cd my-example-package
code . # do your thing, express yourself
npm t
git add .
git commit -m 'a feature'
npm version
git push --follow-tags
npm publish
```

## Structures

There are a number of structures available. The default one is the `package` structure.

| Name | Description | Link |
| ---- | ----------- | ---- |
| `package` | <a name="an-art-deco-nodejs-package">`An Art Deco Node.js Package`</a>. It has everything needed to create high-quality modern application with testing, building and documentation facilities. | [`mnp-package`](https://github.com/artdecocode/mnp-package) |
| `idio` | A <a name="universal-koa-website">Universal Koa Website</a> that allows to write server-side JSX and provides Hot Module Reload. | [`mnp-package`](https://github.com/artdecocode/mnp-idio) |
| structure | A structure for creating new structures with `mnp`. | [`mnp-structure`](https://github.com/artdecocode/mnp-package) |
## `Package` Structure

The default package structure is an up-to-date template of how a standard Node.js package should look like.
### Main Function

Every package will have a main file specified in the `main` field in the package.json file, unless they have a `bin` field otherwise (in other words, if package does not provide a Node.js API, and only CLI usage). This structure has a minimum example of working function which is exported with `export default` keyword, and documented with JSDoc. It's important to document the config argument in a `typedef` so that other developers are able to see the autocompletion hints when trying to use the function.

```js
import { debuglog } from 'util'

const LOG = debuglog('my-new-package')

/**
 * {{ description }}
 * @param {Config} config Configuration object.
 * @param {string} config.type The type.
 */
export default async function myNewPackage(config = {}) {
  const {
    type,
  } = config
  LOG('my-new-package called with %s', type)
  return type
}

/**
 * @typedef {Object} Config
 * @property {string} type The type.
 */
```

![Config Api Type](doc/config.gif)
### Test Suites

The tests are found in the `test/spec` directory, and all necessary infrastructure in the `test` dir, including a `fixture` directory and optionally a `snapshot` directory if the package is using snapshot testing.

```m
node_modules/mnp-package/structure/test
├── context
│   └── index.js
├── fixture
│   └── test.txt
└── spec
    └── default.js
```

The tests are written with `zoroaster` framework, which expects a file to export a test suite as an object, containing tests as its properties. Tests can be both asynchronous and synchronous, and `zoroaster/assert` includes a `throws` method to assert that the function throws, as well as `deepEqual` with color difference.

```js
import { equal, ok } from 'zoroaster/assert'
import Context from '../context'
import myNewPackage from '../../src'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  'is a function'() {
    equal(typeof myNewPackage, 'function')
  },
  async 'calls package without error'() {
    await myNewPackage()
  },
  async 'gets a link to the fixture'({ FIXTURE }) {
    const res = await myNewPackage({
      type: FIXTURE,
    })
    ok(res, FIXTURE)
  },
}

export default T
```

If <a name="_snapshot-testing_">_snapshot-testing_</a> is required, it can be additionally installed with `yarn add -DE snapshot-context`. This will allow to write snapshot tests.
### Testing Context

The structure uses a test context -- a feature of `Zoroaster` that lets separate the set-up and tear-down methods from the test implementations. All common methods, e.g., reading a fixture file, should be implemented in the context and accessed via the destructuring capabilities of the JavaScript language. All clean-up code such as destroying a server, can be done in the `_destroy` method of the class.

```js
import { resolve } from 'path'
import { debuglog } from 'util'

const LOG = debuglog('my-new-package')

const FIXTURE = resolve(__dirname, '../fixture')

/**
 * A testing context for the package.
 */
export default class Context {
  async _init() {
    LOG('init context')
  }
  /**
   * Example method.
   */
  example() {
    return 'OK'
  }
  /**
   * Path to the fixture file.
   */
  get FIXTURE() {
    return resolve(FIXTURE, 'test.txt')
  }
  get SNAPSHOT_DIR() {
    return resolve(__dirname, '../snapshot')
  }
  async _destroy() {
    LOG('destroy context')
  }
}
```

When a context is used in tests, there's an access to the test context API:

![JSDoc In Destructuing A FIXTURE Path Via Context](doc/type.gif)

Context testing also allows to split files into mulitple sub-directories much easier.

### Documentation with `doc`

The documentation is pre-processed with [`documentary`](https://github.com/artdecocode/documentary) which simplifies working on the `README.md` file by allowing to split files, and inserting examples and output text in the docs.

```m
node_modules/mnp-package/structure/documentation
├── API
│   └── index.md
├── footer.md
└── index.md
```

To process documentation, `yarn doc` can be used.
### Scripts in `Package.json`

The scripts are useful for testing, running in debugger, building and building documentation.

```json
{
  "name": "my-new-package",
  "version": "1.0.0",
  "description": "{{ description }}",
  "main": "build",
  "scripts": {
    "t": "zoroaster -b",
    "test": "zoroaster -b test/spec",
    "test-build": "BABEL_ENV=test-build yarn test",
    "test-all": "yarn-s test test-build",
    "test-watch": "yarn test -w",
    "lint": "eslint .",
    "doc": "NODE_DEBUG=doc doc documentation -o README.md",
    "rec": "NODE_DEBUG=appshot appshot -T 23 -a Terminal -y 150 -f",
    "e": "node example",
    "example/": "yarn e example/example.js",
    "build": "yarn-s b doc",
    "b": "b --source-maps"
  },
  "files": [
    "build"
  ],
  "repository": {
    "type": "git",
    "url": "{{ git_url }}"
  },
  "keywords": [
    "{{ keywords }}"
  ],
  "author": "{{ author_name }} <{{ author_email }}>",
  "license": "MIT",
  "bugs": {
    "url": "{{ issues_url }}"
  },
  "homepage": "{{ readme_url }}",
  "devDependencies": {
    "documentary": "1.7.0",
    "eslint-config-artdeco": "1.0.0",
    "yarn-s": "1.1.0",
    "zoroaster": "2.1.0"
  }
}
```

| script | meaning | description |
| ------ | ------- | ----------- |
| `t` | test a single file or directory | To run: `yarn t test/spec/lib.js` |
| `b` | <a name="build-with-_bestie_">build with _bestie_</a> | The package uses [`bestie`](https://github.com/artdecocode/bestie) to not have to install all `@babel` dependencies in each project directory individually. Instead, after the package has been created, it will be linked to the local version of `bestie`, which needs to be cloned beforehand. E.g., `babel src --out-dir build --copy-files` becomes just `b --copy-files`. |
| `doc` | <a name="document-with-_documentary_">document with _documentary_</a> | Is run with `yarn doc`, but is also a part of `build` script. |
| `test` | <a name="test-with-_zoroaster_">test with _zoroaster_</a> | Run all tests, `yarn test`. |
| `test-build` | test build files | Run all tests by requiring all files from the build directory and not the `src`. This is possible with the `babel-plugin-transform-rename-import` which changes `../src` to `../build` (also as part of a bigger path such as `../../src/lib`). |
| `lint` | run eslint | `eslint` is not installed as a dependency, because it can be installed globally easily. It will also work in the IDE if installed globally fine. However, [`eslint-config-artdeco`](https://github.com/artdecocode/eslint-config-artdeco) config is specified as a dependency. |
###  `.babelrc` Transforms

The main reason behind using `.babelrc` is to be able to use `import` and `export` syntax which is made possible with the `modules` babel transform. Moreover, the `babel-plugin-transform-rename-import` allows to run tests against the built code by substituting the path on the fly via a regex.

```json
{
  "plugins": [
    "@babel/plugin-syntax-object-rest-spread",
    "@babel/plugin-transform-modules-commonjs"
  ],
  "env": {
    "test-build": {
      "plugins": [
        [
          "transform-rename-import",
          {
            "original": "^((../)+)src",
            "replacement": "$1build"
          }
        ]
      ],
      "ignore": [
        "build/**/*.js"
      ]
    },
    "debug": {
      "retainLines": true
    }
  }
}
```
###  `launch.json` Debugging

Debugging is extremely useful and almost always required way to progress with a development of a software program. A new functionality can be introduced by writing the tests first, and then running them against the source code. That is, the `TDD` approach to testing can be summarised as having to somehow run the code being tested first, and the best place to put it is a test file. By providing a quick sketch of tests, the program can then be debug to see whether the execution flows as expected, and adjust it on-the-fly.

This explains the structure of the `launch.json` file, which will have a configuration to start `Zoroaster` testing in `watch` mode, so that it is not necessary to restart the node process every time. Also, if changes are made during a pause in code, the execution need to be let run completely first before a changed version can be run. A known issue is that `source-maps-support` will not update positions of errors including their line and this leads to incorrect presentation of errors. `retainLines` is also needed for `@babel/register` to work correctly with the debugger which is set via the `BABEL_ENV=debug`.

```json5
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Zoroaster",
      "program": "${workspaceFolder}/node_modules/.bin/zoroaster",
      "env": {
        "BABEL_ENV": "debug",
        "ZOROASTER_TIMEOUT": "9999999",
        "NODE_DEBUG": "my-new-package",
      },
      "console": "integratedTerminal",
      "args": [
        "test/spec",
        "-b",
        "-w",
      ],
      "skipFiles": [
        "<node_internals>/**/*.js"
      ]
    }
  ]
}
```

## todo

* offline
* create own structures
* keywords
* fetch repo info
* global manager

---

(c) [Art Deco Code](https://artdeco.bz) 2018

[1]: https://github.com/settings/tokens
