import { join, parse, relative, normalize, basename } from 'path'
import spawn from 'spawncommand'
import { renameSync, unlinkSync, writeFileSync } from 'fs'
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
   */
  constructor(projectDir, files, github) {
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
  }
  async spawn(command, args = [], opts = {}) {
    const { quiet, ...op } = opts
    const { promise } = spawn(command, args, {
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
  get askQuestions() {
    return askQuestions
  }
  get askSingle() {
    return askSingle
  }
  get confirm() {
    return confirm
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
      debugger
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
  warn(s) {
    console.log(c(s, 'yellow'))
  }
  /**
   * @param {string} path
   */
  removeFile(path) {
    const p = this.resolve(path)
    unlinkSync(p)
    this.files = this.files.filter(f => f != p)
  }
  renameFile(path, newPath) {
    const p = this.resolve(path)
    const newp = this.resolve(newPath)
    renameSync(p, newp)
    const i = this.files.indexOf(p)
    if (i > -1) {
      const includesAlready = this.hasFile(newp)
      if (!includesAlready) this.files[i] = newp
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
  addFile(file) {
    const path = this.resolve(file)
    const exists = this.files.find(f => f == path)
    if (!exists) {
      this.files.push(path)
    } else if (process.env.DEBUG) console.log('File %s already present.', file)
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
      r.path = ff
      r.debug = (...args) => {
        if (process.env.DEBUG) console.log(...args)
      }
      const res = await replace(r, content)
      await write(ff, res)
    }))
  }
}