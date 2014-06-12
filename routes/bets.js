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
    put: function (req, res) {
        db.Bet.findAll({
            where: {
                user_id: req.user.id,
            },
            include: [
                {
                    model: db.Game,
                    where: {
                        score_a: {ne: null},
                        score_b: {ne: null}
                    }
                }
            ]
        }).success(function (bets) {
            var need_update = [],
                now = 0,
                before = 0;
            bets.forEach(function (bet) {
                var points = bet.points();
                now += points;
                if (bet.validated) {
                    before += points;
                } else {
                    need_update.push(bet.id)
                }
            });

            if (need_update.length > 0) {
                db.Bet.update(
                    {validated: true},
                    {id: need_update}
                )

                db.User.update(
                    {points: now},
                    {id: req.user.id}
                )
            }
            res.json({
                points: {
                    now: now,
                    before: before
                }
            })
        });
    },
    read: function (req, res) {
        var game_include = [
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
        ];

        var where = {
            game_id: req.params.id
        };
        if (req.query.friends) {
            var friends = req.query.friends.split(',');
            where.user_id = friends;
        } else if (req.query.all) {
        } else {
            where.user_id = req.user.id;
        }

        var filters = {
            attributes: db.Bet.attrs(),
            where: where,
            include: [
                {
                    model: db.Game,
                    attributes: db.Game.attrs(),
                    include: game_include
                }
            ]
        }

        if (!req.query.friends && !req.query.all) {
            db.Bet.find(filters).success(function (bet) {
                if (!bet) {
                    db.Game.find({
                        where: {id: req.params.id},
                        attributes: db.Game.attrs(),
                        include: game_include
                    }).success(function (game) {
                        var bet = {
                            game: game,
                            score_a: null,
                            score_b: null,
                            user_id: req.user.id,
                        };
                        res.json(bet);
                    })
                } else {
                    res.json(bet);
                }
            })
        } else {
            db.Bet.findAll({
                attributes: db.Bet.attrs(),
                where: where,
                include: [
                    {
                        model: db.User,
                        attributes: db.User.attrs(),
                    }
                ]
            }).success(function (bets) {
                bets = bets.map(function (bet) {
                    if (req.user.id === bet.user_id) {
                        bet.values.me = true;
                    }
                    return bet;
                })
                res.json(bets);
            });
        }
    }
}
