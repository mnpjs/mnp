### Scripts in `Package.json`

The scripts are useful for testing, running in debugger, building and building documentation.

%EXAMPLE: node_modules/mnp-package/structure/package.json, json%

The package uses [`bestie`](t) to not have to install all `babel` dependencies in each project directory. Instead, after the package has been created, it will be linked to the local version `bestie`, which needs to be cloned beforehand. Instead of running `babel src --out-dir build --copy-files`, it is possible to run just `b --copy-files`.
