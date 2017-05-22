const https = require('https')
const Catchment = require('catchment')

function createRepo(token, packageName, org) {
    const data = JSON.stringify({
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
}
