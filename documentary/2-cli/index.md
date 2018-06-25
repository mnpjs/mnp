
## CLI: `mnp my-new-package`

The default mode is to start creating a package. If `package-name` is not passed, the program will run in interactive mode and ask to enter details.

```sh
mnp [package-name]
```

To use the module, enter `mnp cool-package-name`, or just `mnp` to be asked for the name. `mnp` will check if directory does not exist and not in a git path, create a `Github` repository, clone it to local filesystem, and fill in the default _Node.js_ package structure.

<table>
<tr><td>
![Creating a new package.](doc/create.gif)
</td></tr>
<tr><td>
[`Creating Packages`](t) with `mnp` is super-easy!
</td></tr>
</table>

<!-- ```fs
Please give package name: mynewpackage
# mynewpackage
Description: example-package
Cloning into './mynewpackage'...
Setting user Author<author@testt.cc>...
Cloned the structure to /mynewpackage
Created new repository: https://github.com/org/mynewpackage#readme
``` -->

<!-- ### Create a Package -->


<!-- ![creation process](https://sobes.s3.eu-west-2.amazonaws.com/mnp-make.gif)

```bash
cd ~/packages
mnp my-example-package # create a new package
cd my-example-package
yarn # install dependencies
code . # write test, src code
yarn t
git add .
git commit -m 'a feature'
npm version
git push --follow-tags
npm publish
``` -->

<!-- Documentary: to run a program and answer the questions with stdin  -->

### `-h, --help`: Show Help

%FORK src/bin/register.js -h%

### `-c`: Check Exists

Check if the package name is already taken or not.

```sh
mnp -c taken
```

![taken output](doc/taken.png)

```sh
mnp -c isfree
```

![free output](doc/free.png)

### Config

When launched for the first time, you will be asked to complete the set-up process. You will need a [GitHub token][1]. Organisation name is optional, if supplied repositories will be created for it. `name` and `email` will be used in `package.json` and in local git config. `website` is the link in the readme. `legal name` is what goes in _LICENCE_ and also in readme as the website name if organisation name is not given.

![configuration process](https://sobes.s3.eu-west-2.amazonaws.com/mnp-config2.gif)
