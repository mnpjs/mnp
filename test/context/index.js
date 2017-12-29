const makePromise = require('makepromise')
const fs = require('fs')
const { resolve, basename } = require('path')
const { tmpdir } = require('os')
const { readDir } = require('wrote')

const temp = tmpdir()
const TEMP = resolve(temp, 'mnp_test.context')

async function findName(parent, initialName, n = 0) {
    const currentName = `${initialName}${n ? `-${n}` : ''}`
    const path = resolve(parent, currentName)
    try {
        await makePromise(fs.stat, path)
        throw new Error('dir exists')
    } catch (err) {
        if (err.message === 'dir exists') {
            return findName(parent, initialName, n + 1)
        }
        return path
    }
}

async function mnpContext() {
    this.cwd = TEMP

    this.packagePath = await findName(TEMP, 'test-package')
    this.packageName = basename(this.packagePath)

    const expectedStructurePath = resolve(__dirname, '../fixtures/expected-cloned/')
    this.readExpectedStructure = () => readDir(expectedStructurePath, true)
    this.readDir = dir => readDir(dir, true)

    try {
        await makePromise(fs.mkdir, TEMP)
    } catch (err) { /* */ }

    console.log('%s expected', this.packageName)

    this._destroy = async () => {
        try {
            await makePromise(fs.rmdir, this.packagePath)
        } catch (err) { /* can't remove recursively */ }
    }
}

module.exports = mnpContext
