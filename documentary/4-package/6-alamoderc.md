### _.alamoderc.json_

`alamode` is a fast Regex-based JavaScript transpiler which is capable of transforming `import` and `export` statements into `require` calls and `module.export` assignments. Because the stable Node.js contains most in not all of the features that could be wanted by developers, except for the ECMAScript 6 modules, the code inside packages is transpiled with `alamode` either during the build process, or via a require hook. It also allows to substitute the path to the source directory, e.g., when testing the build with the `test-build` command when `ALAMODE_ENV` is set to `test-build`.

<!-- The main reason behind using `.babelrc` is to be able to use `import` and `export` syntax which is made possible with the `modules` babel transform. Moreover, the `babel-plugin-transform-rename-import` allows to run tests against the built code by substituting the path on the fly via a regex. -->

%EXAMPLE: node_modules/@mnpjs/package/structure/.alamoderc.json, json5%
<!--
However, when `bestie` implements the support for `RegExp`-based fast build of the modules, the `@babel` dependency will be removed. -->

%~ width="15"%