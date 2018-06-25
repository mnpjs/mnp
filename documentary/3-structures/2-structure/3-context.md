#### Testing Context

The structure uses a test context -- a feature of `Zoroaster` that lets separate the set-up and tear-down methods from the test implementations. All common methods, e.g., reading a fixture file, should be implemented in the context and accessed via the destructuring capabilities of the JavaScript language. All clean-up code such as destroying a server, can be done in the `_destroy` method of the class.

%EXAMPLE: node_modules/mnp-package/structure/test/context/index.js%

Context testing also allows to split files into mulitple sub-directories much easier.

