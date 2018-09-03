### Scripts in `Package.json`

The scripts are useful for testing, running in debugger, building and building documentation.

%EXAMPLE: node_modules/@mnpjs/package/structure/package.json, json%

```table
[
  ["Script", "Meaning", "Description"],
  ["`t`", "Test a single file or directory.", "To run: `yarn t test/spec/lib.js`."],
  ["`b`", "[Build With _À La Mode_](t).", "The package uses [`alamode`](https://github.com/a-la/alamode) to allow writing `import` and `export` statements."],
  ["`doc`", "[Document With _Documentary_](t).", "Is run with `yarn doc`, but is also a part of the `build` script."],
  ["`build`", "Run `b` and `doc` in series.", "Builds source code into the `build` directory, and compiles documentation to the `README.md` file."],
  ["`test`", "[Test With _Zoroaster_](t).", "Run all tests, `yarn test`."],
  ["`test-build`", "Test build files.", "Run all tests by requiring all files from the build directory and not the `src`. This is possible with the `babel-plugin-transform-rename-import` which changes `../src` to `../build` (also as part of a bigger path such as `../../src/lib`)."],
  ["`e`", "Run an example file.", "Run specified example, e.g., `yarn e example/test.js`."],
  ["`example/`", "Run a <a name=\"particular-example\">particular example</a>.", "A job specifically created as a short-hand for a particular example."],
  ["`lint`", "Check code style.", "`eslint` is not installed as a dependency, because it can be installed globally easily. It will also work in the IDE if installed globally fine. However, [`eslint-config-artdeco`](https://github.com/artdecocode/eslint-config-artdeco) config is specified as a dependency."]
]
```
