exports = require('./' + (process.env.NODE_ENV || 'dev') + '.js')

exports.POINTS = {
    perfect: 50,
    win: 20,
    lost: 0
}
exports.social = {
    facebook: {
        clientID: '1477567782456567',
        clientSecret: '566da822e81081ebd07917030807dc44',
        app_access_token: '1477567782456567|8ROrWZQS-UuNnljuYhiF_vguPd0'
    }
};

exports.raven = {
    url: "https://d121e324c60f455e86d9ffe47b048304:2883319b17c643df92dd5a0b6ddbce90@app.getsentry.com/118"
}

exports.database = exports.database || process.env.DATABASE_URL;
exports.redis.url = exports.redis.url || process.env.REDISCLOUD_URL;

module.exports = exports
