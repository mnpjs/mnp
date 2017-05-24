const assert = require('assert')
const fs = require('fs')
const makePromise = require('makepromise')
const spawnCommand = require('spawncommand')
const path = require('path')

const TEMP = path.join(__dirname, '../temp/')
const BIN_PATH = path.join(__dirname, '../../bin/mnp')

const myPackageNameTestSuite = {
    'should call the binary': () => {
        const proc = spawnCommand(BIN_PATH, ['test-package-name'])
        return proc.promise
    },
    'should create a new package in the cwd': () => {
        const tempPath = path.join(TEMP, `mnp-test-${Date.now()}`)
        const packageName = 'test-package'
        const packagePath = path.join(tempPath, packageName)
        const unlinkTemp = () => makePromise(fs.rmdir, tempPath)
        const unlinkPackage = () => makePromise(fs.rmdir, packagePath)

        return makePromise(fs.mkdir, tempPath) // init - context
            .then(() => {
                const proc = spawnCommand(BIN_PATH, [packageName], {
                    cwd: tempPath,
                })
                return proc.promise
            })
            .then(() => makePromise(fs.stat, packagePath))
            // destroy - context
            .then(() => unlinkPackage())
            .then(unlinkTemp, unlinkTemp)
    },
}

module.exports = myPackageNameTestSuite
