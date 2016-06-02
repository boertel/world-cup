var db = require('../models');

module.exports = {
    read: function(req, res) {
        var where = {
            user_id: req.user.id,
        }
        db.Friend.findAll({
            attributes: ['username'],
            where: where,
            raw: true
        }).then(function(rows) {
            usernames = rows.map(function(row) { return row.username; });
            usernames.push(req.user.username);
            db.User.findAll({
                where: {
                    username: {$in: usernames}
                },
                order: 'points DESC, first_name ASC',
            }).then(function(users) {
                users.forEach(function (user) {
                    if (req.user.id == user.id) {
                        user.setDataValue('me', true);
                    }
                });
                res.json(users);
            });
        });
    }
}
