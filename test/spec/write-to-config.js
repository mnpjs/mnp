const assert = require('assert')
const Catchment = require('catchment')
const fs = require('fs')
const makePromise = require('makepromise')
const path = require('path')
const lib = require('../../src/lib')

const FIXTURES = path.join(__dirname, '../fixtures/')
const TEMP = path.join(__dirname, '../temp/')

const _DEFAULT_CONFIG = path.join(FIXTURES, 'default-config.json')
const _CONFIG_PATH = path.join(TEMP, '.mnp.json')

const context = function Context() {
    Object.defineProperties(this, {
        DEFAULT_CONFIG: {
            get: () => _DEFAULT_CONFIG,
        },
        CONFIG_PATH: {
            get: () => _CONFIG_PATH,
        },
        _destroy: () => {
            // unlink temp if created
            return makePromise(fs.unlink, this.CONFIG_PATH)
                .then(() => {}, (err) => {
                    if (!/ENOENT/.test(err.message)) {
                        throw err
                    }
                })
        },
    })
}


const readConfigTestSuite = {
    context,
    '_should make sure temp is clear': (ctx) => {
        return makePromise(fs.unlink, ctx.CONFIG_PATH)
            .then(() => {}, (err) => {
                if (!/ENOENT/.test(err.message)) {
                    throw err
                }
            })
    },
    'should create a new config': (ctx) => {
        return lib.readConfig(ctx.CONFIG_PATH, ctx.DEFAULT_CONFIG)
            .then(() => {
                const rs = fs.createReadStream(ctx.CONFIG_PATH)
                const catchment = new Catchment()
                rs.pipe(catchment)
                return catchment.promise
            })
            .then((res) => {
                const parsedRes = JSON.parse(res)
                const defaultConf = require(ctx.DEFAULT_CONFIG)
                assert.deepEqual(parsedRes, defaultConf)
            })
    },
}

module.exports = {
    readConfigTestSuite,
}
