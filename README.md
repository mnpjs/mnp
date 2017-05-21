# my-new-package
Quickly create a Node.js package with a Github repository

## Create a new pacakge with globally installed mpn

```bash
cd ~/Packages
mnp my-example-package
...
ls
cd my-example-package
ls
{{ structure }}

```

### Structure

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
  "description": "A new package generated with my-new-package",
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

(Zoroaster)[https://www.npmjs.com/package/zoroaster] is the testing framework

```bash
> zoroaster test/spec

 test/spec
   index.js
    ✓  should be a function
my-new-package called
    ✓  should call package without error

Executed 2 tests.
```

## myPackageName()

Require and call your new pacakge:

```js
const myPackageName = require('my-new-package')

myPackageName()
```

---

(c) 2017
