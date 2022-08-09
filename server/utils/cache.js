const NodeCache = require('node-cache')

const myCache = new NodeCache({ stdTTL: 60 * 5 })

exports.myCache = myCache
