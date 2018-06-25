# mnp

%NPM: mnp%

`mnp` aka _My New Package_ is a global npm package which allows to quickly create a new _Node.js_ package with a default structure (`src`, `test`, `package.json`, _etc_) and initialise a _GitHub_ repository.

## Table Of Contents

%TOC%


<!--
### Structure

The following structure will be initialised, which is a good start for any
_Node.js_ project.

```fs
src/
 ` index.js
test/
 - fixtures/
 - context/
   ` index.js
 ` spec/
   `index.js
.eslintrc.js
CHANGELOG.md
example.js
LICENSE
package.json
README.md
.gitignore
```

### package.json

```json
{
  "name": "my-example-package",
  "version": "0.1.0",
  "description": "An example package",
  "main": "src/index.js",
  "scripts": {
    "test": "zoroaster test/spec",
    "test-watch": "zoroaster test/spec --watch"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/author/my-example-package.git"
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
    "url": "https://github.com/author/my-example-package/issues"
  },
  "homepage": "https://github.com/author/my-example-package#readme",
  "devDependencies": {
    "zoroaster": "0.4.6"
  }
}
```

### npm t

[Zoroaster](https://www.npmjs.com/package/zoroaster) is used as the testing
framework for this project.

```bash
> zoroaster test/spec

 test/spec
   index.js
    ✓  should be a function
my-example-package called
    ✓  should call package without error

Executed 2 tests.
```

`test/context/index.js` contains a test context.

## src/index.js

The index file exports your main function.

```js
const myExamplePackage = require('my-example-package')

myExamplePackage() // well done now!
``` -->
