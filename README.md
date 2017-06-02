# mnp

[![npm version](https://badge.fury.io/js/mnp.svg)](https://badge.fury.io/js/mnp)

`mnp` aka _My New Package_ is a global npm module which allows to quickly create a Node.js package
with a default minimal structure (src, test, etc) and get ready to publish in minutes.

## config

When launched for the first time, you will be asked to complete the setup process.
You will need a [GitHub token](https://github.com/settings/tokens). Organisation
name is optional, if supplied repos will be open for it. `name` and `email` will
be used in `package.json` and in local git config.

![configuration process](https://sobes.s3.eu-west-2.amazonaws.com/mnp-config2.gif)

## Create a new package

To use the module, enter `mnp cool-package-name`, or just `mnp` to be asked for the name. The software will check if directory does not exist, create a Github repo, clone it, set the config, and update `package.json` with appropriate information.

![creation process](https://sobes.s3.eu-west-2.amazonaws.com/mnp-make.gif)


```bash
cd ~/Packages
mnp my-example-package # scaffold your new app
cd my-example-package
code . # do your thing, express yourself
npm t
npm version
git push
git push --tags
npm publish
```

### Structure

The following structure will be initialised, which is pretty much essential for any Node.js project.

```fs
CHANGELOG.md
LICENSE
README.md
example.js
package.json
.gitignore
.eslintrc.js
src/
 ` index.js
test/
 - fixtures/
 ` spec/index.js
```

### package.json

```json
{
  "name": "my-example-package",
  "version": "0.1.0",
  "description": "A new package generated with mnp",
  "main": "src/index.js",
  "scripts": {
    "test": "zoroaster test/spec",
    "test-watch": "zoroaster test/spec --watch"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Author/my-example-package.git"
  },
  "keywords": [
    "npm",
    "package",
    "create",
    "github",
    "git",
    "repo",
    "repository"
  ],
  "author": "Author <name@company.com>",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/Author/my-example-package/issues"
  },
  "homepage": "https://github.com/Author/my-example-package#readme",
  "devDependencies": {
    "zoroaster": "0.4.4"
  }
}
```

### npm t

[Zoroaster](https://www.npmjs.com/package/zoroaster) is used as the testing framework for this
project.

```bash
> zoroaster test/spec

 test/spec
   index.js
    ✓  should be a function
my-example-package called
    ✓  should call package without error

Executed 2 tests.
```

## src/index.js

The index file exports your main function.

```js
const myExamplePackage = require('my-example-package')

myExamplePackage() // well done now!
```

## todo

* offline

---

(c) [Sobesednik-Media](https://sobesednik.media) 2017
