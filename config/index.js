exports = require('./' + (process.env.NODE_ENV || 'dev') + '.js')

exports.POINTS = {
    perfect: 50,
    win: 20,
    lost: 0
}
exports.social = {
    facebook: {
        clientID: "1477567782456567",
        clientSecret: "566da822e81081ebd07917030807dc44"
    }
};

exports.database = exports.database || process.env.DATABASE_URL;
exports.redis.url = exports.redis.url || process.env.REDISCLOUD_URL;

module.exports = exports
