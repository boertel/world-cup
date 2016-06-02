exports = require('./' + (process.env.NODE_ENV || 'dev') + '.js')

exports.social = {
    facebook: {
        clientID: '1477567782456567',
        clientSecret: '566da822e81081ebd07917030807dc44',
        app_access_token: '1477567782456567|8ROrWZQS-UuNnljuYhiF_vguPd0'
    }
};

exports.sentry = process.env.SENTRY;

exports.notification = {
    secret: process.env.NOTIFICATION_SECRET
}

exports.database = process.env.DATABASE_URL || exports.database;
exports.redis.url = process.env.REDIS_URL || exports.redis.url;

module.exports = exports
