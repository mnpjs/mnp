const { join, parse, relative, normalize, basename } = require('path');
const { spawn } = require('../../stdlib');
const git = require('../lib/git');
const { renameSync, unlinkSync, writeFileSync, writeFile, existsSync, lstatSync } = require('fs');
const { indicatrix } = require('../../stdlib');
const { aqt } = require('../../stdlib');
const { c, b } = require('../../stdlib');
const               { askQuestions, askSingle, confirm } = require('../../stdlib');
const { read, write, rm, ensurePath } = require('../../stdlib');
const { Replaceable, replace } = require('../../stdlib');
const { cleanStack } = require('../../stdlib');
const { tmpdir } = require('os');

class API {
  /**
   * @param {string} projectDir
   * @param {!Array<string>} files An array with absolute paths to files.
   */
  constructor(projectDir, files, github, settings) {
    this.projectDir = projectDir
    this.files = files
    this.github = github
    this.proxy = new Proxy(this, {
      get(obj, prop){
        const real = obj[prop]
        if (typeof real == 'function') {
          const handleError = (err) => {
            console.warn(c('Could not run %s', 'yellow'), prop)
            console.warn(cleanStack(err.stack))
          }
          return (...args) => {
            try {
              let r = real.call(obj, ...args)
              if (r instanceof Promise) r = r.catch(handleError)
              return r
            } catch (err) {
              handleError(err)
            }
          }
        }
        return real
      },
    })
    this.settings = settings
  }
  async fixGitignore() {
    await this.updateFiles({
      re: /# start template[\s\S]+?# end template(\n|$)/,
      replacement() {
        this.debug('Fixing .gitignore %s', this.path)
        return ''
      },
    }, { file: '.gitignore' })
  }
  async spawn(command, args = [], opts = {}) {
    const { quiet, ...op } = opts
    const { promise } = spawn(command, args, {
      shell: process.platform == 'win32',
      cwd: this.projectDir,
      stdio: 'inherit',
      ...op,
    })
    try {
      return await promise
    } catch (err) {
      if (quiet) return
      else throw err
    }
  }
  async askQuestions(...args) {
    return await askQuestions(...args)
  }
  async askSingle(...args) {
    return await askSingle(...args)
  }
  async confirm(...args) {
    return await confirm(...args)
  }
  async unzip(file, where) {
    file = normalize(file)
    where = normalize(where)
    if (process.platform == 'win32') {
      await this.spawn('powershell.exe', ['-NoP', 'NonI', '-Command',
        `Expand-Archive '${file}' '${where}'`])
    } else {
      this.warn('Platform %s is not supported for unzip', process.platform)
    }
  }
  async untar(file, where, opts = {}) {
    const { verbose } = opts
    const args = ['-x']
    const gz = file.endsWith('gz')
    if (gz) args.push('-z')
    if (verbose) args.push('-v')
    args.push('-f', normalize(file))
    args.push('-C', where)
    await this.spawn('tar', args)
  }
  async saveArchive(from, to) {
    const f = await this.download(from)
    const path = join(tmpdir(), basename(from))
    writeFileSync(path, f)
    await ensurePath(join(to, 'file'))
    try {
      if (from.endsWith('zip')) {
        await this.unzip(path, to)
      } else {
        await this.untar(path, to)
      }
      return to
    } finally {
      unlinkSync(path)
    }
    // update config
  }
  writeFileSync(path, data) {
    const p = this.resolve(path)
    writeFileSync(p, data)
  }
  async download(url, opts = {}) {
    const { followRedirects = true, ...op } = opts
    const { body, statusCode, statusMessage, headers } = await aqt(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 Node.JS MNP Installer (https://www.npmjs.com/mnp)',
      },
      binary: true,
      ...op,
    })
    if (statusCode == 302 && followRedirects) {
      return await this.download(headers.location, {
        ...opts,
        followRedirects: false,
      })
    }
    if (statusCode != 200) {
      this.warn('%s download failed (%s: %s).', url, statusCode, statusMessage)
      this.warn(body)
    }
    return body
  }
  /**
   * @param {string} s
   */
  warn(s, ...args) {
    console.log(c(s, 'yellow'), ...args)
  }
  /**
   * @param {string} path
   */
  removeFile(path) {
    const p = this.resolve(path)
    unlinkSync(p)
    this.files = this.files.filter(f => f != p)
  }
  async initManager() {
    if (this.settings.manager == 'yarn') {
      try {
        this.removeFile('package-lock.json')
      } catch (err) {
        // ok
      }
      await this.spawn('yarn')
    } else if (this.settings.manager == 'npm') {
      try {
        this.removeFile('yarn.lock')
      } catch (err) {
        // ok
      }
      await this.spawn('npm', ['i'])
    } else {
      this.warn('Your manager (yarn/npm) is not configured in settings.')
    }
  }
  get packageJson() {
    const p = this.resolve('package.json')
    delete require.cache[p]
    const packageJson = require(p)
    return packageJson
  }
  json(file) {
    const p = this.resolve(file)
    delete require.cache[p]
    const f = require(p)
    return f
  }
  saveJson(file, data, indent = 2) {
    const p = this.resolve(file)
    const s = indent ? JSON.stringify(data, null, indent) : JSON.stringify(data)
    writeFileSync(p, s)
  }
  updatePackageJson(data) {
    this.saveJson('package.json', data)
  }
  renameFile(path, newPath) {
    const p = this.resolve(path)
    const newp = this.resolve(newPath)
    try {
      renameSync(p, newp)
      const i = this.files.indexOf(p)
      if (i > -1) {
        const includesAlready = this.hasFile(newp)
        if (!includesAlready) this.files[i] = newp
      }
    } catch (err) {
      if (process.env.DEBUG) console.log(err.message)
    }
  }
  /**
   * @param {string} text
   * @param {Promise} promise
   */
  loading(text, promise) {
    return indicatrix(text, promise)
  }
  /**
   * Returns whether the list of files contains this entry.
   * @param {string} file The file to search (absolute path).
   */
  hasFile(file) {
    return this.files.some(f => f == file)
  }
  async removePackages(packages) {
    if (this.settings.manager == 'npm') {
      await this.spawn('npm', ['uninstall', ...packages])
    } else if (this.settings.manager == 'yarn') {
      await this.spawn('yarn', ['remove', ...packages])
    }
  }
  addFile(file) {
    const path = this.resolve(file)
    const exists = this.files.find(f => f == path)
    if (!exists) {
      this.files.push(path)
    } else if (process.env.DEBUG) console.log('File %s already present.', file)
  }
  async rm(path) {
    path = this.resolve(path)
    try {
      const e = lstatSync(path)
      // if (!e) return
      await rm(path)
      if (e.isDirectory()) {
        this.files = this.files.filter((f) => {
          return !f.startsWith(join(path, '/'))
        })
      } else if (e.isFile()) {
        this.files = this.files.filter((f) => {
          return f != path
        })
      }
    } catch (err) {
      this.warn(err.message)
    }
  }
  /**
   * @param {RegExp} regex The files to remove.
   */
  removeFiles(regex) {
    const leftFiles = []
    const toRemove = this.files.filter((ff) => {
      regex.lastIndex = 0
      if (regex.test(ff)) {
        return true
      } else {
        leftFiles.push(ff)
      }
    })
    toRemove.forEach((ff) => {
      unlinkSync(ff)
    })
    this.files = leftFiles
  }
  resolve(file) {
    return join(this.projectDir, file)
  }
  async git(args, ...moreArgs) {
    if (!Array.isArray(args)) args = [args, ...moreArgs]
    return await git(args, this.projectDir)
  }
  /**
   * @param {!Array<!_restream.Rule>} rules
   * @param {!Array<string>} [extensions]
   */
  async updateFiles(rules, { extensions, file: filename, files } = {}) {
    let fn
    if (typeof filename == 'string') fn = [this.resolve(filename)]
    else if (Array.isArray(files)) fn = files.map(f => this.resolve(f))
    const f = this.files.filter(file => {
      if (extensions) {
        let { ext } = parse(file)
        ext = ext.replace(/^./, '')
        return extensions.includes(ext)
      } else if (Array.isArray(fn)) {
        return fn.includes(file)
      } else return true
    })
    await Promise.all(f.map(async ff => {
      const content = await read(ff)
      const r = new Replaceable(rules)
      r.api = this
      r.path = ff
      r.debug = (...args) => {
        if (process.env.DEBUG) console.log(...args)
      }
      const res = await replace(r, content)
      await write(ff, res)
    }))
  }
}

module.exports = API