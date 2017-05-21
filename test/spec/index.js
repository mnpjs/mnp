const assert = require('assert')
const fs = require('fs')
const makePromise = require('makepromise')
const spawnCommand = require('spawncommand')
const os = require('os')
const path = require('path')
const myPackageName = require('../../src/')

const TEMP_DIR = os.tmpdir()
const BIN_PATH = path.join(__dirname, '../../bin/mnp')

const myPackageNameTestSuite = {
    'should be a function': () => {
        assert.equal(typeof myPackageName, 'function')
    },
    'should call package without error': () => {
        assert.doesNotThrow(() => {
            myPackageName()
        })
    },
    'should call the binary': () => {
        const proc = spawnCommand(BIN_PATH)
        return proc.promise
    },
    'should exit with code 1 if package name is not given': () => {
        return spawnCommand(BIN_PATH).promise
            .then((res) => {
                assert.equal(res.stderr.trim(), 'Please give package name')
            })
    },
    'should create a new package in the cwd': () => {
        const tempPath = path.join(TEMP_DIR, `mnp-test-${Date.now()}`)
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
