# mnp

`mnp` aka _My New Package_ is a global npm module which allows to quickly create a Node.js package
with a default minimal structure (src, test, etc) and get ready to publish in minutes.

## Create a new pacakge with globally installed mpn

To use the module, enter `mnp cool-package-name`. The software will create a new package in the
current directory.

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

(Zoroaster)[https://www.npmjs.com/package/zoroaster] is used as the testing framework for this
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

---

(c) Sobesednik-Media 2017
