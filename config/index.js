exports = require('./' + (process.env.NODE_ENV || 'dev') + '.json')

exports.POINTS = {
    perfect: 50,
    win: 20,
    lost: 0
}

module.exports = exports
