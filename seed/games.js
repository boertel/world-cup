var db = require('../models'),
    moment = require('moment-timezone'),
    Game = db.Game,
    Competitor = db.Competitor


module.exports = function () {
    return Competitor.findAll().then(function (rows) {
        // Shortcuts for the competitors
        var competitors = {}
        rows.forEach(function (c) {
            competitors[c.name] = c.id
        })

        function addGame(number, time, a, b, group) {
            var m = moment.tz(time, 'America/Sao_Paulo')
            return {
                number: number,
                time: m.tz('UTC').format(),
                competitor_a_id: competitors[a],
                competitor_b_id: competitors[b],
                group_id: group
            }
        }

        return Game.bulkCreate([
            addGame(1, '2014-06-12 17:00:00', 'Brazil', 'Croatia', 1),
            addGame(2, '2014-06-13 13:00:00', 'Mexico', 'Cameroon', 1),
            addGame(17, '2014-06-17 16:00:00', 'Brazil', 'Mexico', 1),
            addGame(18, '2014-06-18 18:00:00', 'Cameroon', 'Croatia', 1),
            addGame(33, '2014-06-23 17:00:00', 'Cameroon', 'Brazil', 1),
            addGame(34, '2014-06-23 17:00:00', 'Croatia', 'Mexico', 1),

            addGame(3, '2014-06-13 16:00:00', 'Spain', 'Netherlands', 2),
            addGame(4, '2014-06-13 18:00:00', 'Chile', 'Australia', 2),
            addGame(19, '2014-06-18 16:00:00', 'Spain', 'Chile', 2),
            addGame(20, '2014-06-18 13:00:00', 'Australia', 'Netherlands', 2),
            addGame(35, '2014-06-23 13:00:00', 'Australia', 'Spain', 2),
            addGame(36, '2014-06-23 13:00:00', 'Netherlands', 'Chile', 2),

            addGame(5, '2014-06-14 13:00:00', 'Colombia', 'Greece', 3),
            addGame(6, '2014-06-14 22:00:00', 'Côte d\'Ivoire', 'Japan', 3),
            addGame(21, '2014-06-19 13:00:00', 'Colombia', 'Côte d\'Ivoire', 3),
            addGame(22, '2014-06-19 19:00:00', 'Japan', 'Greece', 3),
            addGame(37, '2014-06-24 16:00:00', 'Japan', 'Colombia', 3),
            addGame(38, '2014-06-24 17:00:00', 'Greece', 'Côte d\'Ivoire', 3),

            addGame(7, '2014-06-14 16:00:00', 'Uruguay', 'Costa Rica', 4),
            addGame(8, '2014-06-14 18:00:00', 'England', 'Italy', 4),
            addGame(23, '2014-06-19 16:00:00', 'Uruguay', 'England', 4),
            addGame(24, '2014-06-20 13:00:00', 'Italy', 'Costa Rica', 4),
            addGame(39, '2014-06-24 13:00:00', 'Italy', 'Uruguay', 4),
            addGame(40, '2014-06-24 13:00:00', 'Costa Rica', 'England', 4),

            addGame(9, '2014-06-15 13:00:00', 'Switzerland', 'Ecuador', 5),
            addGame(10, '2014-06-15 16:00:00', 'France', 'Honduras', 5),
            addGame(25, '2014-06-20 16:00:00', 'Switzerland', 'France', 5),
            addGame(26, '2014-06-20 19:00:00', 'Honduras', 'Ecuador', 5),
            addGame(41, '2014-06-25 16:00:00', 'Honduras', 'Switzerland', 5),
            addGame(42, '2014-06-25 17:00:00', 'Ecuador', 'France', 5),

            addGame(11, '2014-06-15 19:00:00', 'Argentina', 'Bosnia and Herzegovina', 6),
            addGame(12, '2014-06-16 16:00:00', 'Iran', 'Nigeria', 6),
            addGame(27, '2014-06-21 13:00:00', 'Argentina', 'Iran', 6),
            addGame(28, '2014-06-21 18:00:00', 'Nigeria', 'Bosnia and Herzegovina', 6),
            addGame(43, '2014-06-25 13:00:00', 'Nigeria', 'Argentina', 6),
            addGame(44, '2014-06-25 13:00:00', 'Bosnia and Herzegovina', 'Iran', 6),

            addGame(13, '2014-06-16 13:00:00', 'Germany', 'Portugal', 7),
            addGame(14, '2014-06-16 19:00:00', 'Ghana', 'USA', 7),
            addGame(29, '2014-06-21 16:00:00', 'Germany', 'Ghana', 7),
            addGame(30, '2014-06-22 18:00:00', 'USA', 'Portugal', 7),
            addGame(45, '2014-06-26 13:00:00', 'USA', 'Germany', 7),
            addGame(46, '2014-06-26 13:00:00', 'Portugal', 'Ghana', 7),

            addGame(15, '2014-06-17 13:00:00', 'Belgium', 'Algeria', 8),
            addGame(16, '2014-06-17 18:00:00', 'Russia', 'Korea Republic', 8),
            addGame(31, '2014-06-22 13:00:00', 'Belgium', 'Russia', 8),
            addGame(32, '2014-06-22 16:00:00', 'Korea Republic', 'Algeria', 8),
            addGame(47, '2014-06-26 17:00:00', 'Korea Republic', 'Belgium', 8),
            addGame(48, '2014-06-26 17:00:00', 'Algeria', 'Russia', 8)

        ])
    })
}
