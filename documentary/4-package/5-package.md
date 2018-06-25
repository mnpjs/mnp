### Scripts in `Package.json`

The scripts are useful for testing, running in debugger, building and building documentation.

%EXAMPLE: node_modules/mnp-package/structure/package.json, json%

```table
[
  ["script", "meaning", "description"],
  ["`t`", "test a single file or directory", "To run: `yarn t test/spec/lib.js`"],
  ["`b`", "[build with `bestie`](t)", "The package uses [`bestie`](https://github.com/artdecocode/bestie) to not have to install all `@babel` dependencies in each project directory individually. Instead, after the package has been created, it will be linked to the local version of `bestie`, which needs to be cloned beforehand. E.g., `babel src --out-dir build --copy-files` becomes just `b --copy-files`."],
  ["`doc`", "[document with `documentary`](t)", "Is run with `yarn doc`, but is also a part of `build` script."],
  ["`test`", "[test with `zoroaster`](t)", "Run all tests, `yarn test"],
  ["`test-build`", "test build files", "Run all tests by requiring all files from the build directory and not the `src`. This is possible with the `babel-plugin-transform-rename-import` which changes `../src` to `../build` (also as part of a bigger path such as `../../src/lib`)."],
  ["lint", "run eslint", "`eslint` is not installed as a dependency, because it can be installed globally easily. It will also work in the IDE if installed globally fine. However, [`eslint-config-artdeco`](https://github.com/artdecocode/eslint-config-artdeco) config is specified as a dependency."]
]
```
