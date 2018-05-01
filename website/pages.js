const fs = require('fs')
const { resolve } = require('path')
const APP_DIR = resolve(__dirname, './app')
const PAGES_DIR = resolve(APP_DIR, './pages')
const BUILD_DIR = resolve(__dirname, './build')

module.exports = {
  layout: resolve(APP_DIR, 'layout/main.html'),
  appDir: APP_DIR,
  pagesDir: PAGES_DIR,
  pagesConf: resolve(__dirname, 'pages.json'),
  pre: [
    {
      re: /{{ navigation }}/,
      replacement: String(fs.readFileSync(resolve(APP_DIR, 'layout/navigation.html'))),
    },
    {
      re: /{{ company }}/g,
      replacement: '[mnp](https://mnpjs.org)',
    },
  ],
  pages: [
    {
      title: 'Main Page',
      url: 'index.html',
      file: 'index.md',
    },
    {
      title: 'Markdown',
      url: 'markdown.html',
      file: 'markdown.md',
    },
    {
      title: 'HighlightJS',
      url: 'highlightjs.html',
      file: 'highlightjs.md',
    },
  ],
  postProcess: [
    {
      re: /{{ year }}/g,
      replacement: `${new Date().getFullYear()}`,
    },
  ],
  output: BUILD_DIR,
}

