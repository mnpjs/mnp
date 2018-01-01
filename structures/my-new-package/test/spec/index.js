const { equal, assert } = require('zoroaster/assert')
const context = require('../context/')
const myNewPackage = require('../..')

const myNewPackageTestSuite = {
    context,
    'should be a function'() {
        equal(typeof myNewPackage, 'function')
    },
    'should call package without error'() {
        assert.doesNotThrow(() => {
            myNewPackage()
        })
    },
}

module.exports = myNewPackageTestSuite
