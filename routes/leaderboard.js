var db = require('../models');

module.exports = {
    read: function (req, res) {
        db.User.findAll({
            order: 'points DESC,first_name ASC'
        }).success(function (users) {
            res.json(users);
        });
    }
}
