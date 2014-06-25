var db = require('../models')


module.exports = {
    profile: {
        read: function (req, res) {
            user_id = req.params.id
            if (user_id === 'me') {
                user_id = req.user.id
            }
            db.User.find({
                where: {id: user_id},
                attributes: db.User.attrs()
            }).success(function (user) {
                res.json(user)
            })
        }
    },
    bets: {
        read: function (req, res) {
            var user_id = req.params.id;
            if (req.params.id === 'me') {
                user_id = req.user.id
            }
            var filters = {
                where: {
                    user_id: user_id
                },
                include: [
                    {
                        model: db.Game,
                        where: {
                            score_a: {ne: null},
                            score_b: {ne: null}
                        },
                        include: [
                            {
                                model: db.Group,
                                attributes: db.Group.attrs()
                            },
                            {
                                model: db.Competitor,
                                as: 'competitor_a',
                                attributes: db.Competitor.attrs()
                            },
                            {
                                model: db.Competitor,
                                as: 'competitor_b',
                                attributes: db.Competitor.attrs()
                            }
                        ]
                    }
                ]
            }
            db.Bet.findAll(filters).success(function (bets) {
                res.json(bets)
            })
        }
    },
    points: {
        post: function (req, res) {
            req.user.publishScore(function (data) {
                return res.json(data);
            });
        }
    }
}
