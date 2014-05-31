var db = require('../models')

module.exports = {
    post: function (req, res) {
        db.Game.find(req.params.id).success(function (game) {
            if (game.lock()) {
                res.json(403, {error: 'Not allowed to bet on this game.'});
            } else {
                db.Bet.findOrCreate({
                    user_id: req.user.id,
                    game_id: game.id
                }, {
                    score_a: req.body.score_a,
                    score_b: req.body.score_b
                }).success(function (bet) {
                    bet.score_a = req.body.score_a,
                    bet.score_b = req.body.score_b
                    bet.save().success(function (bet) {
                        res.json(bet);
                    })
                })
            }
        });
    },
    read: function (req, res) {
        var filters = {
            attributes: db.Bet.attrs(),
            where: {game_id: req.params.id, user_id: req.user.id},
            include: [
                {
                    model: db.Game,
                    attributes: db.Game.attrs(),
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
        db.Bet.find(filters).success(function (bet) {
            if (!bet) {
                var bet = db.Bet.build({
                    game_id: req.params.id,
                    user_id: req.user.id
                });
            }
            res.json(bet);
        })
    }
}
