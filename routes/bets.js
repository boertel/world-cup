var db = require('../models')

module.exports = {
    post: function (req, res) {
        db.Game.findById(req.params.id).then(function (game) {
            if (game.lock()) {
                res.json(403, {error: 'Not allowed to bet on this game.'});
            } else {
                var where ={ user_id: req.user.id, game_id: game.id },
                    defaults = { score_a: req.body.score_a, score_b: req.body.score_b };
                db.Bet.findOrCreate({ where: where, defaults: defaults}).spread(function (bet, created) {
                    bet.score_a = req.body.score_a,
                    bet.score_b = req.body.score_b
                    bet.save().then(function (bet) {
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
                    },
                    include: [
                        {
                            model: db.Competitor,
                            attributes: db.Competitor.attrs()
                        }
                    ]
                }
            ]
        }).then(function (bets) {
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
                attributes: db.Group.attrs(),
                as: 'group',
                include: [
                    { model: db.Points, as: 'points' },
                ]
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
                    as: 'game',
                    attributes: db.Game.attrs(),
                    include: game_include,
                }
            ]
        }

        if (!req.query.friends && !req.query.all) {
            db.Bet.find(filters).then(function (bet) {
                if (!bet) {
                    db.Game.find({
                        where: {id: req.params.id},
                        attributes: db.Game.attrs(),
                        include: game_include
                    }).then(function (game) {
                        game.next().then(function (nextGame) {
                            if (nextGame) {
                                game.setDataValue('next', nextGame.id);
                            }
                            var bet = {
                                game: game,
                                score_a: null,
                                score_b: null,
                                user_id: req.user.id,
                            };
                            res.json(bet);
                        });
                    })
                } else {
                    bet.game.next().then(function (nextGame) {
                        bet.game.setDataValue('next', nextGame.id);
                        res.json(bet);
                    });
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
                    },
                    {
                        model: db.Game,
                        attributes: db.Game.attrs(),
                        as: 'game',
                    }
                ]
            }).then(function (bets) {
                bets = bets.map(function (bet) {
                    if (req.user.id === bet.user_id) {
                        bet.setDataValue('me', true);
                    }
                    bet.setDataValue('type', bet.getType());
                    return bet;
                })
                res.json(bets);
            });
        }
    }
}
