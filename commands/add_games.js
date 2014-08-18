var db = require('../models'),
    moment = require('moment-timezone')


function insert () {

    db.Competitor.findAll().success(function (rows) {
        var competitors = {}

        // Shortcuts for the competitors
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

        var games = [
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
            addGame(21, '2014-07-30 13:45', 'Burnley FC', 'Manchester United', 3),
            addGame(22, '2014-07-30 16:00', 'West Ham United', 'Southampton FC', 3),
            addGame(23, '2014-07-30 16:00', 'Manchester City', 'Stoke City', 3),
            addGame(24, '2014-07-30 16:00', 'Newcastle United', 'Crystal Palace', 3),
            addGame(25, '2014-07-30 16:00', 'QPR', 'Sunderland AFC', 3),
            addGame(26, '2014-07-30 16:00', 'Swansea City', 'West Bromwich Albion', 3),
            addGame(27, '2014-07-30 18:30', 'Everton FC', 'Chelsea FC', 3),
            addGame(28, '2014-07-31 14:30', 'Tottenham Hotspur', 'Liverpool FC', 3),
            addGame(29, '2014-07-31 14:30', 'Aston Villa', 'Hull City', 3),
            addGame(30, '2014-07-31 17:00', 'Leicester City', 'Arsenal FC', 3),
            addGame(31, '2014-08-13 13:45', 'Arsenal FC', 'Manchester City', 4),
            addGame(32, '2014-08-13 16:00', 'West Bromwich Albion', 'Everton FC', 4),
            addGame(33, '2014-08-13 16:00', 'Southampton FC', 'Newcastle United', 4),
            addGame(34, '2014-08-13 16:00', 'Stoke City', 'Leicester City', 4),
            addGame(35, '2014-08-13 16:00', 'Sunderland AFC', 'Tottenham Hotspur', 4),
            addGame(36, '2014-08-13 16:00', 'Crystal Palace', 'Burnley FC', 4),
            addGame(37, '2014-08-13 16:00', 'Chelsea FC', 'Swansea City', 4),
            addGame(38, '2014-08-13 18:30', 'Liverpool FC', 'Aston Villa', 4),
            addGame(39, '2014-08-14 17:00', 'Manchester United', 'QPR', 4),
            addGame(40, '2014-08-15 21:00', 'Hull City', 'West Ham United', 4),
        ];

        games.forEach(function (game) {
            db.Game.find({where: {number: game.number}}).success(function (g) {
                out = game.number;
                if (!g) {
                    db.Game.create(game);
                    out += ' created';
                }
                console.log(out);
            });
        });

    })
}


db.sequelize
    .sync({force: false})
    .complete(function (err) {
        if (err) {
            throw err
        } else {
            insert()
        }
    })
