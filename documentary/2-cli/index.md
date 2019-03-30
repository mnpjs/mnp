## CLI: `mnp my-new-package`

The default mode is to start creating a package. If `package-name` is not passed, the program will run in interactive mode and ask to enter details.

```sh
mnp [package-name] [-D description] [-s structure] [-cIhd]
```

To use the binary, enter `mnp cool-package-name`, or just `mnp` to be asked for the name. `mnp` will check if the directory does not exist and not in a git path, create a `Github` repository, star it, clone it to the local filesystem, and fill in the default _Node.js_ package structure.

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

%~ width="15"%

### `-I`, `--init`: Configure

When launched for the first time, `mnp` will ask to complete the set-up process and create a `.mnprc` file in the directory from which it was called. It is possible to create a default `.mnprc` in the `HOME` directory to remember the token, and then initialise `mnp` in other directories, when it will reuse the token from the `HOME` config, but ask for more details for the current folder. This way, it is easy to manage different organisations and scopes, while reusing the access token.

```table
[
  ["Field", "Description"],
  ["`token`", "A `GitHub` [developer token][1]."],
  ["`organisation`", "An optional `GitHub` organisation name to create repositories for. A personal `GitHub` account is used if not supplied."],
  ["`name`, `email`", "Author's name and email to set in the `package.json` file, and in the project directory's git config. Default values are read from the global git config."],
  ["`scope`", "A scope with which to create packages."],
  ["`website`", "A link location in the copyright section of the `README` file."],
  ["`trademark`", "A display text for the website link in the `README`."],
  ["`legal name`", "A legal name placed in the `LICENCE` file."]
]
```

%GIF doc/init.gif
Initialising the configuration.
Initialising configuration: <code>mnp -I</code>.
%

%~ width="15"%

### `-h`, `--help`: Show Help

<table>
<tbody>
<tr></tr>
<tr>
<td>

%FORK src/bin -h%
</td>
</tr>
</tbody>
</table>

%~ width="15"%

### `-c`, `--check`: Check Exists

Check if the package name is already taken or not.

```table
[
  ["Command", "Output"],
  ["`mnp taken -c`", "![taken output](doc/taken.png)"],
  ["`mnp isfree -c`", "![free output](doc/free.png)"]
]
```

%~ width="15"%

### `-d`, `--delete`: Delete Repository

Delete specified repository from `GitHub`. Useful when a package was created for testing. The organisation name will be read from the configuration.

```sh
mnp package -d
```

%~ width="15"%

### `-@`, `--scope`: Set Scope

When a particular scope needs to be specified for the package, the `-@` option can be used.

```sh
mnp package -@ superscope
```

%~ width="15"%

### `-`, `--scope`: Set Scope

When a particular scope needs to be specified for the package, the `-@` option can be used.

```sh
mnp package -@ superscope
```

%~%