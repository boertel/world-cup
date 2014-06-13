var db = require('../models');

module.exports = {
    read: function (req, res) {
        db.User.findAll({
            order: 'points DESC,first_name ASC'
        }).success(function (users) {
            users.forEach(function (user) {
                if (req.user.id == user.id) {
                    user.values.me = true;
                }
            });
            res.json(users);
        });
    }
}
