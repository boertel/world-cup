var db = require('../models'),
    moment = require('moment-timezone'),
    Game = db.Game,
    Competitor = db.Competitor



module.exports = function (next) {
    Competitor.findAll().success(function (rows) {
        // Shortcuts for the competitors
        var competitors = {}
        rows.forEach(function (c) {
            competitors[c.name] = c.id
        })

        function addGame(number, time, a, b, group) {
            var m = moment.tz(time, 'Europe/London')
            return {
                number: number,
                time: m.tz('UTC').format(),
                competitor_a_id: competitors[a],
                competitor_b_id: competitors[b],
                group_id: group
            }
        }

        Game.bulkCreate([
            addGame(1, '2014-08-16 12:45', 'Manchester United', 'Swansea City', 1),
            addGame(2, '2014-08-16 15:00', 'Leicester City', 'Everton FC', 1),
            addGame(3, '2014-08-16 15:00', 'Queens Park Rangers', 'Hull City', 1),
            addGame(4, '2014-08-16 15:00', 'Stoke City', 'Aston Villa', 1),
            addGame(5, '2014-08-16 15:00', 'West Bromwich Albion', 'Sunderland AFC', 1),
            addGame(6, '2014-08-16 15:00', 'West Ham United', 'Tottenham Hotspur', 1),
            addGame(7, '2014-08-16 17:30', 'Arsenal FC', 'Crystal Palace', 1),
            addGame(8, '2014-08-17 13:30', 'Liverpool FC', 'Southampton FC', 1),
            addGame(9, '2014-08-17 16:00', 'Newcastle United', 'Manchester City', 1),
            addGame(10, '2014-08-18 20:00', 'Burnley FC', 'Chelsea FC', 1),
        ]).success(next)

    })
}
