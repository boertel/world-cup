var db = require('../models')


module.exports = {
    read: function (req, res) {
        var filters = {
            attributes: db.Competitor.attrs()
        }
        if (req.params.id) {
            filters.where = {id: req.params.id}
        }
        db.Competitor.findAll(filters).then(function (competitors) {
            if (req.params.id) {
                competitors = competitors[0]
            }
            res.json(competitors)
        })
    },
    games: {
        read: function (req, res) {
            var competitorId = req.params.id,
                filters
            if (!competitorId) {
                res.status(404)
                return res
            }
            filters = {
                attributes: db.Game.attrs(),
                order: 'number',
                include: [
                    {
                        model: db.Group,
                        as: 'group',
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
                ],
                where: ['competitor_a.id=? or competitor_b.id=?', competitorId, competitorId]
            }

            db.Game.findAll(filters).then(function (games) {
                var games_ids = games.map(function (game) {
                    return game.id
                });

                db.Bet.findAll({
                    where: {
                        user_id: req.user.id,
                        game_id: games_ids
                    },
                    include: [
                        {
                            model: db.Game,
                            attributes: db.Game.attrs(),
                            as: 'game',
                        }
                    ]
                }).then(function (bets) {
                    var mapping = {};
                    bets.forEach(function (bet) {
                        mapping[bet.game_id] = bet;
                    });

                    games = games.map(function (game) {
                        game.setDataValue('bet', mapping[game.id]);
                        return game;
                    });
                    res.json(games)
                })
            })
        }
    }

}
