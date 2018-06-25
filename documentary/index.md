# mnp

%NPM: mnp%

`mnp` aka _My New Package_ is a global npm package which allows to quickly create a new _Node.js_ package with a default structure (`src`, `test`, `package.json`, _etc_) and initialise a _GitHub_ repository.

## Table Of Contents

%TOC%

### CLI: `mnp my-new-package`

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

<!-- Documentary: to run a program and answer the questions with stdin  -->

#### `-h, --help`: Show Help

%FORK node src/bin/regsiter.js -h%

#### `-c`: Check Exists

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
