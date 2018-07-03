###  `.babelrc` Transforms

The main reason behind using `.babelrc` is to be able to use `import` and `export` syntax which is made possible with the `modules` babel transform. Moreover, the `babel-plugin-transform-rename-import` allows to run tests against the built code by substituting the path on the fly via a regex.

%EXAMPLE: node_modules/@mnpjs/package/structure/.babelrc, json%
<!--
However, when `bestie` implements the support for `RegExp`-based fast build of the modules, the `@babel` dependency will be removed. -->
