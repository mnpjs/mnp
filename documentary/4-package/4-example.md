#### `Examples` Embedding

The examples are extremely useful for people reading the documentation, and they also allow developers to manually check that everything works correctly in the package. `documentary` supports embedding of examples and their output, eliminating the need to copy those by hand. The examples are put in the `example` directory, and embedded in the README file with the following snippet:

```
%EXAMPLE: example example/example.js, ../src => mnp, javascript%
```

The output can be printed with the `FORK` command:

```
%FORK-json example example/example.js%
```

%EXAMPLE: node_modules/@mnpjs/package/structure/example/example.js%

Because the examples are written using `import` and `export` syntax, a `index.js` file is required which will include `@babel/register`:

```js
require('@babel/register')
const { resolve } = require('path')

const p = resolve(__dirname, '..', process.argv[2])
require(p)
```

To provide a quick way to run examples, each of them needs to be [created a script](#particular-example) for in the `package.json`.
