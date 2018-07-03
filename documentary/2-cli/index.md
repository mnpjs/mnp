
## CLI: `mnp my-new-package`

The default mode is to start creating a package. If `package-name` is not passed, the program will run in interactive mode and ask to enter details.

```sh
mnp [package-name] [-s structure] [-cIhd]
```

To use the module, enter `mnp cool-package-name`, or just `mnp` to be asked for the name. `mnp` will check if directory does not exist and not in a git path, create a `Github` repository, clone it to local filesystem, and fill in the default _Node.js_ package structure.

<table>
<tbody>
<tr>
</tr>
<tr>
<td>[Creating Packages](t)</td>
</tr>
<tr>
<td><img src="doc/create.gif" alt="Creating a new package."></td>
</tr></tbody></table>

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

### `-I`, `--init`: Configure

When launched for the first time, `mnp` will ask to complete the set-up process and  create `HOMEDIR/.mnprc` file.

```table
[
  ["Field", "Description"],
  ["`token`", "A `GitHub` [developer token][1]."],
  ["`organisation`", "An optional `GitHub` organisation name and if supplied repositories will be created for it."],
  ["`name`, `email`", "Used in `package.json` and the local project directory git config. Default values for which are read from the global git config."],
  ["`website`", "Link in the `README` file."],
  ["`legal name`", "Is placed in the _LICENCE_ and also in the README file as the website name if organisation name is not given."]
]
```

%GIF doc/init.gif
Initialising the configuration.
Initialising configuration: <code>mnp -I</code>.
%

### `-h, --help`: Show Help

<table>
<tbody>
<tr></tr>
<tr>
<td>

%FORK src/bin/register.js -h%
</td>
</tr>
</tbody>
</table>

### `-c`: Check Exists

Check if the package name is already taken or not.

```sh
mnp taken -c
```

![taken output](doc/taken.png)

```sh
mnp isfree -c
```

![free output](doc/free.png)

### `-d`: Delete Repository

Delete specified repository from `GitHub`. Useful when a package was created for testing.

```sh
mnp -d test
```


<!-- ![configuration process](https://sobes.s3.eu-west-2.amazonaws.com/mnp-config2.gif) -->
