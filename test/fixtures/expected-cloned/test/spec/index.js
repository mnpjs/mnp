const assert = require('assert')
const context = require('../context/')
const testPackage_10 = require('../../src/')

const testPackage_10TestSuite = {
    context,
    'should be a function': () => {
        assert.equal(typeof testPackage_10, 'function')
    },
    'should call package without error': () => {
        assert.doesNotThrow(() => {
            testPackage_10()
        })
    },
}

module.exports = testPackage_10TestSuite
