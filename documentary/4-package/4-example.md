#### `Examples` Embedding

The examples are extremely useful for people reading the documentation, and they also allow developers to manually check that everything works correctly in the package. `documentary` supports embedding of examples and their output, eliminating the need to copy those by hand. The examples are put in the `example` directory, and embedded in the README file with the following snippet:

```
%EXAMPLE: example/example, ../src => mnp%
```

The paths to JS and JSX files will be resolved automatically, however to embed the source of other files, the extension should be passed. To specify the markdown language, it can be passed at the end, otherwise it will be determined from the file extension:

```
%EXAMPLE: example/config.yml, yaml%
```

The output can be printed with the `FORK` command:

```
%FORK-json example/example%
```

%EXAMPLE: node_modules/@mnpjs/package/structure/example/example%

Because the examples are written using `import` and `export` syntax, the `index.js` file is required which will include `alamode`:

```js
require('alamode')()
require(`../${process.argv[2]}`)
```

However, this is not required to fork examples for documentation, because _Documentary_ will take care of the `import` and `export` statements by using ÀLaMode internally. To disable that, the `_FORK` should be used instead.

Forking also supports caching, so that examples don't have to be rerun each time the documentation changes in a different place. This allows to recompile the output `README.md` much faster. Caches include module's mtime and its dependencies' versions if they are packages, or mtimes if they are other modules. To disable caching globally, the `doc` command can be run with `-c`, or `!FORK` should be specified for individual forks. Because caches rely on mtime, they are not submitted to git.

To provide a quick way to run examples, each of them needs to be [created a script](#particular-example) for in the `package.json`.

%~ width="15"%