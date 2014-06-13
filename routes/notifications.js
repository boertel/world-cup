var db = require('../models'),
    FB = require('fb'),
    config = require('../config');

exports = {
    read: function (req, res) {
        console.log(req.query.secret !== config.notification.secret, req.query.secret, config.notification.secret)
        if (req.query.secret !== config.notification.secret) {
            res.json({status: 'hell no!'});
        }

        var sequelize = db.sequelize;

        var beginning = new Date(),
            end = new Date(beginning.getTime() + 24 * 60 * 60000),
            data = {
                template: 'Don\'t forget to bet on the World Cup matches'
            }

        sequelize.query('SELECT u.username FROM "User" u WHERE id NOT IN (SELECT b.user_id FROM "Game" g LEFT JOIN "Bet" b ON g.id = b.game_id WHERE time >= ? AND time <= ? GROUP by b.user_id);', null, { raw: true }, [beginning, end])
            .success(function (usernames) {
                var access_token = config.social.facebook.app_access_token
                FB.setAccessToken(access_token);
                usernames.map(function (user) {
                    FB.api('/' + user.username + '/notifications', 'post', data, function (response) {
                        console.log(response)
                        res.json({status: 'I don\'t care'})
                    })
                })
            });
    }
}

module.exports = exports;
