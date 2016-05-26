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

        function addGame(number, a, b, time, group) {
            var m = moment.tz(time, 'Europe/Paris')
            return {
                number: number,
                time: m.tz('UTC').format(),
                competitor_a_id: competitors[a],
                competitor_b_id: competitors[b],
                group_id: group
            }
        }

        return Game.bulkCreate([
            addGame(1, 'France', 'Romania', '2016-06-10 21:00:00', 1),
            addGame(2, 'Albania', 'Switzerland', '2016-06-11 15:00:00', 1),
            addGame(14, 'Romania', 'Switzerland', '2016-06-15 18:00:00', 1),
            addGame(15, 'France', 'Albania', '2016-06-15 21:00:00', 1),
            addGame(26, 'Switzerland', 'France', '2016-06-19 21:00:00', 1),
            addGame(25, 'Romania', 'Albania', '2016-06-19 21:00:00', 1),

            addGame(3, 'Wales', 'Slovakia', '2016-06-11 18:00:00', 2),
            addGame(4, 'England', 'Russia', '2016-06-11 21:00:00', 2),
            addGame(13, 'Russia', 'Slovakia', '2016-06-15 15:00:00', 2),
            addGame(16, 'England', 'Wales', '2016-06-16 16:00:00', 2),
            addGame(28, 'Slovakia', 'England', '2016-06-20 21:00:00', 2),
            addGame(27, 'Russia', 'Wales', '2016-06-20 21:00:00', 2),

            addGame(6, 'Poland', 'Northern Ireland', '2016-06-12 18:00:00', 3),
            addGame(7, 'Germany', 'Ukraine', '2016-06-12 21:00:00', 3),
            addGame(17, 'Ukraine', 'Northern Ireland', '2016-06-16 18:00:00', 3),
            addGame(18, 'Germany', 'Poland', '2016-06-16 21:00:00', 3),
            addGame(30, 'Northern Ireland', 'Germany', '2016-06-21 18:00:00', 3),
            addGame(29, 'Ukraine', 'Poland', '2016-06-21 18:00:00', 3),

            addGame(5, 'Turkey', 'Croatia', '2016-06-12 15:00:00', 4),
            addGame(8, 'Spain', 'Czech Republic', '2016-06-13 15:00:00', 4),
            addGame(20, 'Czech Republic', 'Croatia', '2016-06-17 18:00:00', 4),
            addGame(21, 'Spain', 'Turkey', '2016-06-17 21:00:00', 4),
            addGame(32, 'Croatia', 'Spain', '2016-06-21 21:00:00', 4),
            addGame(31, 'Czech Republic', 'Turkey', '2016-06-21 21:00:00', 4),

            addGame(9, 'Republic of Ireland', 'Sweden', '2016-06-13 18:00:00', 5),
            addGame(10, 'Belgium', 'Italy', '2016-06-13 21:00:00', 5),
            addGame(19, 'Italy', 'Sweden', '2016-06-17 15:00:00', 5),
            addGame(22, 'Belgium', 'Republic of Ireland', '2016-06-18 15:00:00', 5),
            addGame(36, 'Sweden', 'Belgium', '2016-06-22 21:00:00', 5),
            addGame(35, 'Italy', 'Republic of Ireland', '2016-06-22 21:00:00', 5),

            addGame(11, 'Austria', 'Hungary', '2016-06-14 18:00:00', 6),
            addGame(12, 'Portugal', 'Iceland', '2016-06-14 21:00:00', 6),
            addGame(23, 'Iceland', 'Hungary', '2016-06-18 18:00:00', 6),
            addGame(24, 'Portugal', 'Austria', '2016-06-18 21:00:00', 6),
            addGame(33, 'Iceland', 'Austria', '2016-06-22 18:00:00', 6),
            addGame(34, 'Hungary', 'Portugal', '2016-06-22 18:00:00', 6),
        ])
    })
}


