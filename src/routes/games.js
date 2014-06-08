var db = require('../models')


module.exports = {
    read: function (req, res) {
        var filters = {
            attributes: db.Game.attrs(),
            order: 'number',
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
        if (req.params.id) {
            filters.where = {id: req.params.id}
        }
        if (req.query.offset) {
            filters.offset = req.query.offset
        }
        if (req.query.limit) {
            filters.limit = req.query.limit
        }
        db.Game.findAll(filters).success(function (games) {
            var games_ids = games.map(function (game) {
                return game.id
            });

            db.Bet.findAll({
                where: {
                    user_id: req.user.id,
                    game_id: games_ids
                }
            }).success(function (bets) {
                var mapping = {};
                bets.forEach(function (bet) {
                    mapping[bet.game_id] = bet;
                });

                if (req.params.id) {
                    games = games[0]
                }
                games = games.map(function (game) {
                    game.values.bet = mapping[game.id]
                    return game;
                });
                res.json(games)
            })
        })
    }
}
