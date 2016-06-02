var db = require('../models');

module.exports = {
    post: function(req, res) {
        db.Social.find({where: {user_id: req.user.id}}).then(function(social) {
            social.credentials = JSON.stringify({access_token: req.body.access_token});
            social.save();
            return res.json({});
        })
    }
};
