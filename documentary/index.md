# mnp

%NPM: mnp%

`mnp` aka _My New Package_ is a Node.JS CLI binary that allows to quickly create new _Node.js_ (or any other language) packages from _GitHub_ templates and with a _GitHub_ repository.

MNP provides a number of modern essential templates for package and web development with default structures (`src`, `test`, `package.json`, _etc_).

- <kbd>📦 [Package Template](../../wiki/Package Template)</kbd>: the most essential _Node.JS_ package structure with automated documentation and wiki pages, context and mask testing, 0-dependency import/export transpiler and _Closure Compiler_ integration to properly compile Node.JS packages.
- <kbd>🥝 [Splendid Template](../../wiki/Splendid Template)</kbd>: vital static website generator that utilises Closure Stylesheets to minify CSS, supports JSX syntax for Preact components and statically rendered HTML.

But in addition to the provided templates, you can point to your own _GitHub_ template, which will contain the installation script. The installation script receives access to the API and allows to ask additional questions, e.g.,

```js
// mnp/index.js
export default {
  questions: {
    website: {
      text: 'Website',
      getDefault({ org, name }) {
        return `https://${org}.github.io/${name}`
      },
      async afterQuestions({ github }, answer, { org, name }) {
        await github.pages.enable(org, name, {
          branch: 'master',
          path: '/docs',
        })
      }
    }
  }
}
```

%~%

## Table Of Contents

%TOC%

%~%