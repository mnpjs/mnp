'use strict'

const https = require('https')
const Catchment = require('catchment')
const wrote = require('wrote')
const fs = require('fs')
const makePromise = require('makepromise')

function readFile(filepath) {
    const rs = fs.createReadStream(filepath)
    const catchment = new Catchment()
    rs.pipe(catchment)
    return catchment.promise
}

function requireConfig(dataPath) {
    return Promise.resolve()
        .then(() => {
            const config = require(dataPath)
            return config
        })
}

function cloneConfig(srcPath, destPath) {
    let defaultConfig
    return readFile(srcPath)
        .then((res) => {
            defaultConfig = res
            return wrote(destPath)
        })
        .then((ws) => {
            return makePromise(ws.end.bind(ws), defaultConfig)
        })
}

function readConfig(configPath, defaultConfigPath) {
    return requireConfig(configPath)
        .catch((er) => {
            // does not exist
            if (!/Cannot find module/.test(er.message)) {
                throw er
            }
            return cloneConfig(defaultConfigPath, configPath)
                .then(() => {
                    return requireConfig(configPath)
                }) // should work now
        })
}

/**
 * Create a new github repo
 * @param {string} token github access token
 * @param {string} packageName Name of the new package and directory to create
 * @param {string} [org] Organisation
 * @param {string} [description] Description for github
 */
function createRepo(token, packageName, org, description) {
    const data = JSON.stringify({
        description,
        name: packageName,
        auto_init: true,
        gitignore_template: 'Node',
        license_template: 'mit',
    })
    const options = {
        host: 'api.github.com',
        path: org ? `/orgs/${org}/repos` : '/user/repos',
        headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'User-Agent': 'Mozilla/5.0 mnp Node.js',
        },
        method: 'POST',
    }
    return new Promise((resolve) => {
        const apiRequest = https.request(options, resolve)
        apiRequest.write(data)
        apiRequest.end()
    })
    .then((res) => {
        const catchment = new Catchment()
        res.pipe(catchment)
        return catchment.promise
    })
    .then((res) => {
        const parsed = JSON.parse(res)
        if (Array.isArray(parsed.errors)){
            const reduced = parsed.errors.reduce((acc, error) => {
                const errMsg = `${error.resource}: ${error.message}`
                return `${errMsg}\n${acc}`
            }, '').trim()
            throw new Error(reduced)
        }
        return parsed
    })
}

module.exports = {
    createRepo,
    readConfig,
    readFile,
}
