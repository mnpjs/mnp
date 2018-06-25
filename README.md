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
    * [`bestie`](#bestie)
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

There are a number of structures used available. The default one is the `package` structure.

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

The package uses <a name="bestie">`bestie`</a> to not have to install all `babel` dependencies in each project directory. Instead, after the package has been created, it will be linked to the local version `bestie`, which needs to be cloned beforehand. Instead of running `babel src --out-dir build --copy-files`, it is possible to run just `b --copy-files`.

## todo

* offline
* create own structures
* keywords
* fetch repo info
* global manager

---

(c) [Art Deco Code](https://artdeco.bz) 2018

[1]: https://github.com/settings/tokens
