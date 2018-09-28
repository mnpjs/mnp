// can execute a command
const { createWriteStream } = require('fs')
createWriteStream('result.txt').end('data')

/* expected */
data
/**/