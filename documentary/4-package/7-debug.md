###  `launch.json` Debugging

Debugging is very useful and almost always required way to progress with a development of a software program. A new functionality can be introduced by writing the tests first, and then running them against the source code. That is, the `TDD` approach to testing can be summarised as having to somehow run the code being tested first, and the best place to put it in is a test file. By providing a quick sketch of tests, the program can then be debugged to see whether the execution flows as expected, and adjust it on-the-fly.

This explains the structure of the `launch.json` file, which will have a configuration to start `Zoroaster` testing in `watch` mode, so that it is not necessary to restart the Node process every time. Also, if changes are made during a pause at a breakpoint, the execution will need finish running completely first before a changed version can be run.

%EXAMPLE: node_modules/@mnpjs/package/structure/.vscode/launch.json, json5%
<!--
However, when `bestie` implements the support for `RegExp`-based fast build of the modules, the `@babel` dependency will be removed. -->
