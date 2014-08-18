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
            var m = moment.tz(time, 'Europe/Paris')
            return {
                number: number,
                time: m.tz('UTC').format(),
                competitor_a_id: competitors[a],
                competitor_b_id: competitors[b],
                group_id: group
            }
        }

        Game.bulkCreate([
            addGame(1, '2014-08-16 13:45', 'Manchester United', 'Swansea City', 1),
            addGame(2, '2014-08-16 16:00', 'Leicester City', 'Everton FC', 1),
            addGame(3, '2014-08-16 16:00', 'QPR', 'Hull City', 1),
            addGame(4, '2014-08-16 16:00', 'Stoke City', 'Aston Villa', 1),
            addGame(5, '2014-08-16 16:00', 'West Bromwich Albion', 'Sunderland AFC', 1),
            addGame(6, '2014-08-16 16:00', 'West Ham United', 'Tottenham Hotspur', 1),
            addGame(7, '2014-08-16 18:30', 'Arsenal FC', 'Crystal Palace', 1),
            addGame(8, '2014-08-17 14:30', 'Liverpool FC', 'Southampton FC', 1),
            addGame(9, '2014-08-17 17:00', 'Newcastle United', 'Manchester City', 1),
            addGame(10, '2014-08-18 21:00', 'Burnley FC', 'Chelsea FC', 1),
            addGame(11, '2014-07-23 13:45', 'Aston Villa', 'Newcastle United', 2),
            addGame(12, '2014-07-23 16:00', 'Crystal Palace', 'West Ham United', 2),
            addGame(13, '2014-07-23 16:00', 'Chelsea FC', 'Leicester City', 2),
            addGame(14, '2014-07-23 16:00', 'Southampton FC', 'West Bromwich Albion', 2),
            addGame(15, '2014-07-23 16:00', 'Swansea City', 'Burnley FC', 2),
            addGame(16, '2014-07-23 18:30', 'Everton FC', 'Arsenal FC', 2),
            addGame(17, '2014-07-24 14:30', 'Hull City', 'Stoke City', 2),
            addGame(18, '2014-07-24 14:30', 'Tottenham Hotspur', 'QPR', 2),
            addGame(19, '2014-07-24 17:00', 'Sunderland AFC', 'Manchester United', 2),
            addGame(20, '2014-07-25 21:00', 'Manchester City', 'Liverpool FC', 2),
        ]).success(next)

    })
}
