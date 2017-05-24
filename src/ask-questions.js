const reloquent = require('reloquent')

/**
 * Ask a set of questions.
 * @param questions An object with questions as values
 * @returns {Promise} a promise where keys from the questions object are validated, assigned
 * default values if required, and populated with answers. Validation function should either throw
 * or return nothing (well it can return anything but who cares).
 */
function askQuestions(questions, timeout, singleValue) {
    return Object.keys(questions).reduce((acc, questionKey) => {
        let previousResult
        let question
        return acc.then((res) => {
            previousResult = res
            const currentQuestion = questions[questionKey]
            let realQuestion
            if (typeof currentQuestion === 'object') {
                realQuestion = Object.assign({}, currentQuestion)
            } else if (typeof currentQuestion === 'string') {
                realQuestion = Object.assign({}, { text: currentQuestion })
            } else {
                throw new Error('Question must be a string or an object')
            }
            return realQuestion
        })
        .then((realQuestion) => {
            if (typeof realQuestion.getDefault === 'function') {
                const res = realQuestion.getDefault()
                if (res instanceof Promise) {
                    return res.then((defaultInQuestion) => {
                        const text = `${realQuestion.text}: [${defaultInQuestion}] `
                        return Object.assign({}, realQuestion, {
                            text,
                            defaultInQuestion,
                        }) // reassign text
                    })
                }
                const text = `${realQuestion.text}(${res})`
                return Object.assign({}, realQuestion, {
                    text,
                    defaultInQuestion: res,
                }) // reassign text
            }
            return realQuestion
        })
        .then((res) => {
            question = res
        })
        .then(() => {
            const rl = reloquent(question.text, timeout)
            return rl.promise
        })
        .then((a) => {
            let answer = a
            if (typeof question.validation === 'function') {
                question.validation(answer)
            }
            if (typeof question.postProcess === 'function') {
                answer = question.postProcess(answer)
            }
            const realAnswer = answer || question.defaultInQuestion || question.defaultValue
            // console.log(answer, question.defaultInQuestion, question.defaultValue, realAnswer)
            return Object.assign({}, previousResult, { [questionKey]: realAnswer })
        })
    }, Promise.resolve({}))
        .then((res) => {
            if (typeof singleValue === 'string') {
                return res[singleValue]
            }
            return res
        })
}

module.exports = askQuestions
