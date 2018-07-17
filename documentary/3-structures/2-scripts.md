
## Scripts

At certain stages during the creation of a new package, `mnp` will run scripts specified in the `package.json` of a structure. For example, the `package` structure will run `yarn` to install dependencies right after the package is created.

Scripts should be specified in the `mnp` field of the `package.json` file either as a string, or an array, for example:

```json
{
  "name": "@mnpjs/package",
  "mnp": {
    "onCreate": [
      "yarn"
    ]
  }
}
```

If a script is given as a `.js` file which exists in the structure directory, it will be executed with Node.js:

```json
{
  "name": "@mnpjs/structure",
  "mnp": {
    "onCreate": "scripts/mkdir.js"
  }
}
```