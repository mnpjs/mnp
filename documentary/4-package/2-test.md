### Test Suites

The tests are found in the `test/spec` directory, and all necessary infrastructure in the `test` dir, including a `fixture` directory and optionally a `snapshot` directory if the package is using snapshot testing.

%TREE node_modules/@mnpjs/package/structure/test%

The tests are written with `zoroaster` framework, which expects a file to export a test suite as an object, containing tests as its properties. Tests can be both asynchronous and synchronous, and `zoroaster/assert` includes a `throws` method to assert that the function throws, as well as `deepEqual` with color difference.

%EXAMPLE: node_modules/@mnpjs/package/structure/test/spec/default.js%

If [_snapshot-testing_](t) is required, it can be additionally installed with `yarn add -DE snapshot-context`. This will allow to write snapshot tests.

%~ width="15"%