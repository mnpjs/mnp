## `Package` Structure

The default package structure is an up-to-date template of a modern Node.js application.

<table>
<tbody>
<tr></tr>
<tr>
<td>

%TREE node_modules/@mnpjs/package/structure -a%
</td>
</tr>
</tbody>
</table>

It also includes `yarn.lock` file to speed up the installation process.

<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/0.svg|width=15]]
</a></p>

### Main Function

Every package will have a main file specified in the `main` field in the package.json file, unless they have a `bin` field otherwise (in other words, if package does not provide a Node.js API, and only CLI usage). This structure has a minimum example of working function which is exported with `export default` keyword, and documented with JSDoc. It's important to document the config argument in a `typedef` so that other developers are able to see the autocompletion hints when trying to use the function.

%EXAMPLE: node_modules/@mnpjs/package/structure/src/index.js%

![Config Api Type](doc/config.gif)

<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/1.svg|width=15]]
</a></p>

### Test Suites

The tests are found in the `test/spec` directory, and all necessary infrastructure in the `test` dir, including a `fixture` directory and optionally a `snapshot` directory if the package is using snapshot testing.

%TREE node_modules/@mnpjs/package/structure/test%

The tests are written with `zoroaster` framework, which expects a file to export a test suite as an object, containing tests as its properties. Tests can be both asynchronous and synchronous, and `zoroaster/assert` includes a `throws` method to assert that the function throws, as well as `deepEqual` with color difference.

%EXAMPLE: node_modules/@mnpjs/package/structure/test/spec/default.js%

If <a name="_snapshot-testing_">_snapshot-testing_</a> is required, it can be additionally installed with `yarn add -DE snapshot-context`. This will allow to write snapshot tests.

<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/2.svg|width=15]]
</a></p>

### Testing Context

The structure uses a test context -- a feature of `Zoroaster` that lets separate the set-up and tear-down methods from the test implementations. All common methods, e.g., reading a fixture file, should be implemented in the context and accessed via the destructuring capabilities of the JavaScript language. All clean-up code such as destroying a server, can be done in the `_destroy` method of the class.

%EXAMPLE: node_modules/@mnpjs/package/structure/test/context/index.js%

When a context is used in tests, there's an access to the test context API:

![JSDoc In Destructuing A FIXTURE Path Via Context](doc/type.gif)

Context testing also allows to split files into mulitple sub-directories much easier.

<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/3.svg|width=15]]
</a></p>

### Documentation with `doc`

The documentation is pre-processed with [`documentary`](https://github.com/artdecocode/documentary) which simplifies working on the `README.md` file by allowing to split files, and inserting examples and output text in the docs.

%TREE node_modules/@mnpjs/package/structure/documentary%

To process documentation, the `yarn doc` command can be run.

<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/4.svg|width=15]]
</a></p>

#### `Examples` Embedding

The examples are extremely useful for people reading the documentation, and they also allow developers to manually check that everything works correctly in the package. `documentary` supports embedding of examples and their output, eliminating the need to copy those by hand. The examples are put in the `example` directory, and embedded in the README file with the following snippet:

```
%EXAMPLE: example/example, ../src => mnp%
```

The paths to JS and JSX files will be resolved automatically, however to embed the source of other files, the extension should be passed. To specify the code block language in output markdown, it can be passed at the end, otherwise it will be determined from the file extension:

```
%EXAMPLE: example/config.yml, yaml%
```

The output can be printed with the `FORK` command:

```
%FORK-json example/example%
```

%EXAMPLE: node_modules/@mnpjs/package/structure/example%

Because the examples are written using `import` and `export` syntax, _ÀLaMode_ transpiler bundlers `alanode` binary, which is added as an alias with `yarn e` command, e.g., `yarn e example/` or `yarn e example/second`. However, this is not required to fork examples for documentation, because _Documentary_ will take care of the `import` and `export` statements by using _ÀLaMode_ internally. To disable that, the `_FORK` should be used instead.

Forking also supports caching, so that examples don't have to be rerun each time the documentation changes in a different place. This allows to recompile the output `README.md` much faster. Caches include module's mtime and its dependencies' versions if they are packages, or mtimes if they are other modules. To disable caching globally, the `doc` command can be run with `-c`, or `!FORK` should be specified for individual forks. Because caches rely on mtime, they are not submitted to git.

To provide a quick way to run examples, each of them needs to be [created a script](#particular-example) for in the `package.json`.

<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/5.svg|width=15]]
</a></p>

### Scripts in `Package.json`

The scripts are useful for testing, running in debugger, building and building documentation.

%EXAMPLE: node_modules/@mnpjs/package/structure/package.json, json5%

The description of each script is as follows:

|    Script    |                          Meaning                           |                                                                                                                                  Description                                                                                                                                   |
| ------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `t` | Test a single file or directory.                           | To run: `yarn t test/spec/lib.js`.                                                                                                                                                                                                                               |
| `b` | <a name="build-with-_à-la-mode_">Build With _À La Mode_</a>.                               | The package uses [`alamode`](https://github.com/a-la/alamode) to allow writing `import` and `export` statements.                                                                   |
| `doc` | <a name="document-with-_documentary_">Document With _Documentary_</a>.                          | Is run with `yarn doc`, but is also a part of the `build` script.                                                                                                                                                 |
| `build` | Run `b` and `doc` in series. | Builds source code into the `build` directory, and compiles documentation to the `README.md` file.                                                                                                                 |
| `test` | <a name="test-with-_zoroaster_">Test With _Zoroaster_</a>.                                | Run all tests, `yarn test`.                                                                                                                                                                                                                        |
| `test-build` | Test build files.                                          | Run all tests by requiring all files from the build directory and not the `src`. This is possible with the `babel-plugin-transform-rename-import` which changes `../src` to `../build` (also as part of a bigger path such as `../../src/lib`). |
| `e` | Run an example file.                                       | Run specified example, e.g., `yarn e example/test.js`.                                                                                                                                                                                                          |
| `example/` | Run a <a name="particular-example">particular example</a>. | A job specifically created as a short-hand for a particular example.                                                                                                                                                                                                           |
| `lint` | Check code style.                                          | `eslint` is not installed as a dependency, because it can be installed globally easily. It will also work in the IDE if installed globally fine. However, [`eslint-config-artdeco`](https://github.com/artdecocode/eslint-config-artdeco) config is specified as a dependency. |

<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/6.svg|width=15]]
</a></p>

### _.alamoderc.json_

`alamode` is a fast Regex-based JavaScript transpiler which is capable of transforming `import` and `export` statements into `require` calls and `module.export` assignments. Because the stable Node.js contains most in not all of the features that could be wanted by developers, except for the ECMAScript 6 modules, the code inside packages is transpiled with `alamode` either during the build process, or via a require hook. It also allows to substitute the path to the source directory, e.g., when testing the build with the `test-build` command when `ALAMODE_ENV` is set to `test-build`.

%EXAMPLE: node_modules/@mnpjs/package/structure/.alamoderc.json, json5%
<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/7.svg|width=15]]
</a></p>

###  `launch.json` Debugging

Debugging is very useful and almost always required way to progress with a development of a software program. A new functionality can be introduced by writing the tests first, and then running them against the source code. That is, the `TDD` approach to testing can be summarised as having to somehow run the code being tested first, and the best place to put it in is a test file. By providing a quick sketch of tests, the program can then be debugged to see whether the execution flows as expected, and adjust it on-the-fly.

This explains the structure of the `launch.json` file, which will have a configuration to start `Zoroaster` testing in `watch` mode, so that it is not necessary to restart the Node process every time. Also, if changes are made during a pause at a breakpoint, the execution will need finish running completely first before a changed version can be run.

%EXAMPLE: node_modules/@mnpjs/package/structure/.vscode/launch.json, json5%


<p align="center"><a href="#table-of-contents">
  [[/.documentary/section-breaks/8.svg]]
</a></p>