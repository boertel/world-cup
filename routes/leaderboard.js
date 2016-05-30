var db = require('../models');

module.exports = {
    read: function (req, res) {
        db.User.findAll({
            order: 'points DESC,first_name ASC'
        }).then(function (users) {
            users.forEach(function (user) {
                if (req.user.id == user.id) {
                    user.setDataValue('me', true);
                }
            });
            res.json(users);
        });
    }
}
