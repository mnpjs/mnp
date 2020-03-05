import { join, parse, relative, normalize, basename } from 'path'
import spawn from 'spawncommand'
import git from '../lib/git'
import { renameSync, unlinkSync, writeFileSync, writeFile, existsSync, lstatSync } from 'fs'
import indicatrix from 'indicatrix'
import { aqt } from 'rqt'
import { c, b } from 'erte'
import askQuestions, { askSingle, confirm } from 'reloquent'
import { read, write, rm, ensurePath } from '@wrote/wrote'
import { Replaceable, replace } from 'restream'
import cleanStack from '@artdeco/clean-stack'
import { tmpdir } from 'os'

export default class API {
  /**
   * @param {string} projectDir
   * @param {!Array<string>} files An array with absolute paths to files.
   * @param {import('@rqt/github')} github GitHub client.
   * @param {import('../../').Settings} settings The settings.
   */
  constructor(projectDir, files, github, settings) {
    this.projectDir = projectDir
    /** @type {!Array<string>} */
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
  /**
   * Execute a command asynchronously in the project dir.
   * @param {string} command
   * @param {!Array<string>} [args] arguments
   * @param {import('child_process').SpawnOptions} [opts] Spawn options.
   */
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
  /**
   * Writes file to the project directory synchrnously.
   * @param {string} path The path to the file in the project dir.
   * @param {Buffer|string} data The contents to write.
   */
  writeFileSync(path, data) {
    const p = this.resolve(path)
    writeFileSync(p, data)
  }
  /**
   * Downloads a file.
   * @param {string} url The url to the file.
   */
  async download(url, { followRedirects = true, ...op } = {}) {
    const { body, statusCode, statusMessage, headers } = await aqt(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 Node.JS MNP Installer (https://www.npmjs.com/mnp)',
      },
      binary: true,
      ...op,
    })
    if (statusCode == 302 && followRedirects) {
      return await this.download(headers.location, {
        ...op,
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
   * Removes file from the project synchrnously.
   * @param {string} path The path to the file to remove inside the project dir.
   */
  removeFile(path) {
    const p = this.resolve(path)
    unlinkSync(p)
    this.files = this.files.filter(f => f != p)
  }
  /**
   * Calls either `yarn` or `npm i`, and removes `package-lock.json` or `yarn.lock` respectively.
   */
  async initManager() {
    const { manager } = this.settings
    if (!manager) {
      this.warn('Your manager (yarn/npm) is not configured in settings.')
      return
    }
    if (manager == 'yarn') {
      try {
        this.removeFile('package-lock.json')
      } catch (err) {
        // ok
      }
      await this.spawn('yarn')
    } else if (manager == 'npm') {
      try {
        this.removeFile('yarn.lock')
      } catch (err) {
        // ok
      }
      await this.spawn('npm', ['i'])
    }
  }
  /**
   * Reads package.json of the project and returns it as an object.
   * @return {{
   * name: string,
   * version: string,
   * description: string,
   * main: string,
   * files: Array<string>,
   * bin: Object<string, string>,
   * keywords: Array<string>,
   * scripts: Object<string, string>,
   * dependencies: Object<string, string>,
   * devDependencies: Object<string, string>,
   * }}
   */
  get packageJson() {
    const p = this.resolve('package.json')
    delete require.cache[p]
    const packageJson = require(p)
    return packageJson
  }
  /**
   * Reads file as JSON.
   * @param {string} file Path to the file inside of the project dir.
   */
  json(file) {
    const p = this.resolve(file)
    delete require.cache[p]
    const f = require(p)
    return f
  }
  /**
   * Saves file as serialised JSON
   * @param {string} path The path to the file inside the project dir.
   * @param {Object} data Data to serialise and write to the file.
   */
  saveJson(path, data, indent = 2) {
    const p = this.resolve(path)
    const s = indent ? JSON.stringify(data, null, indent) : JSON.stringify(data)
    writeFileSync(p, s)
  }
  /**
   * Saves package.json contents with new data.
   * @param {Object} data The new package.json object.
   */
  updatePackageJson(data) {
    this.saveJson('package.json', data)
  }
  /**
   * Renames file.
   * @param {string} path Old path.
   * @param {string} newPath New path.
   */
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
   * Show loading indicator with ellipsis, e.g., `Fetching data...`
   * @param {string} text The loading text to show.
   * @param {Promise} promise The promise, or function to await for.
   */
  async loading(text, promise) {
    return await indicatrix(text, promise)
  }
  /**
   * Returns whether the list of files contains this entry.
   * @param {string} file The file to search (absolute path).
   */
  hasFile(file) {
    return this.files.some(f => f == file)
  }
  /**
   * Removes installed packages. Useful to clear up dependencies used for installation.
   */
  async removePackages(packages) {
    const { manager } = this.settings
    if (manager == 'npm') {
      await this.spawn('npm', ['uninstall', ...packages])
    } else if (manager == 'yarn') {
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
  /**
   * Removes files and directories by path.
   * @param {string} path The path to the file or directory inside the project dir.
   */
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
   * Removes files by regex synchronously.
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
  /**
   * Returns path to the file inside the project dir.
   * @param {string} path Relative path to the file.
   */
  resolve(path) {
    return join(this.projectDir, path)
  }
  /**
   * Runs `git` inside the project.
   * - `git('add', '.')`
   * - `git('add .')`
   * - `git(['add', '.'])`
   * @param {string|Array<string>} args A string with args like `add .` or `add` or an array with arguments.
   */
  async git(args, ...moreArgs) {
    if (!Array.isArray(args)) args = [args, ...moreArgs]
    return await git(args, this.projectDir)
  }
  /**
   * Update files using a regular expression.
   * @param {!Array<!_restream.Rule>} rules
   * @param {Target} [target] What files to update.
   */
  async updateFiles(rules, target = {}) {
    if (Array.isArray(target)) {
      target = { files: target }
    } else if (typeof target == 'string') {
      target = { file: target }
    }
    const { extensions, file: filename, files } = /** @type {ExtendedTarget} */ (target)
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
  /**
   * Keeps JS blocks, remving the wrapping, e.g., `/＊ block-start ＊/ [- block contents -] /＊ block-end ＊/`, where block is the name of the block will remain just `[-block contents-]`.
   * @param {string} name
   * @param {Target} [target]
   */
  async keepBlocks(name, target) {
    const re = new RegExp(`(\r?\n)?/\\* ${name}-(start|end) \\*/`, 'g')
    await this.updateFiles({
      re,
      replacement() {
        this.debug(`Kepping block ${name} in ${this.file}.`)
        return ''
      },
    }, target)
  }
  /**
   * Removes JS blocks completely, like `/＊ block-start ＊/ [- block contents -] /＊ block-end ＊/`, where block is the name of the block. The example will be gone from the file completely.
   * @param {string} name The name of the block.
   * @param {Target} [target]
   */
  async removeBlocks(name, target) {
    const re = new RegExp(`(\r?\n)?/\\* ${name}-start \\*/[\\s\\S]+?/\\* ${name}-end \\*/`, 'g')
    await this.updateFiles({
      re,
      replacement() {
        this.debug(`Removing block ${name} from ${this.file}.`)
        return ''
      },
    }, target)
  }
}

/**
 * @typedef {string|!Array<string>|ExtendedTarget} Target
 */

/**
 * @typedef {Object} ExtendedTarget
 * @prop {!Array<string>} extensions
 * @prop {string} file
 * @prop {!Array<string>} files
 */