const path = require('path')
const lib = require('../../src/lib')

const FIXTURES = path.join(__dirname, '../fixtures/')

const libTestSuite = {
    'should read a file': () => {
        //return lib.readFile()
    },
}

module.exports = libTestSuite
