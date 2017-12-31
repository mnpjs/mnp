const assert = require('assert')
const { resolve } = require('path')
const { erase, createWritable, read, exists } = require('wrote')
const { readConfig } = require('../../src/lib')

const FIXTURES = resolve(__dirname, '../fixtures/')
const TEMP = resolve(__dirname, '../temp/')

const DEFAULT_CONFIG = resolve(FIXTURES, '.mnprc')
const CONFIG_PATH = resolve(TEMP, '.mnprc')

async function ensureErase(path) {
    if (!path) {
        throw new Error('path must be specified')
    }
    const doesExist = await exists(path)
    if (doesExist) {
        const ws = await createWritable(path)
        await erase(ws)
    }
}

const context = async function Context() {
    Object.defineProperties(this, {
        DEFAULT_CONFIG: {
            get: () => DEFAULT_CONFIG,
        },
        CONFIG_PATH: {
            get() { return CONFIG_PATH },
        },
        _destroy: { value: async () => {
            // unlink temp if created
            await ensureErase(CONFIG_PATH)
        }},
        readDefaultConf: { value: async () => {
            const json = await read(DEFAULT_CONFIG)
            const parsed = JSON.parse(json)
            return parsed
        }},
    })
}


const readConfigTestSuite = {
    context,
    async 'should create a new config if current one does not exist'({
        CONFIG_PATH, DEFAULT_CONFIG, readDefaultConf,
    }) {
        await readConfig(CONFIG_PATH, DEFAULT_CONFIG)

        const json = await read(CONFIG_PATH)
        const parsed = JSON.parse(json)
        const expected = await readDefaultConf()
        assert.deepEqual(parsed, expected)
    },
}

module.exports = {
    readConfigTestSuite,
}
