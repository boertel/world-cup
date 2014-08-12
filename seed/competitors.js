var Competitor = require('../models').Competitor

module.exports = function (next) {
    return Competitor.bulkCreate([
        {name: 'Arsenal'},
        {name: 'Aston Villa'},
        {name: 'Burnley'},
        {name: 'Chelsea'},
        {name: 'Crystal Palace'},
        {name: 'Everton'},
        {name: 'Hull City'},
        {name: 'Leceister City'},
        {name: 'Liverpool'},
        {name: 'Manchester City'},
        {name: 'Manchester United'},
        {name: 'Newcastle United'},
        {name: 'Queens Park Rangers'},
        {name: 'Southampton'},
        {name: 'Tottenham Hotspur'},
        {name: 'Stoke City'},
        {name: 'Sunderland'},
        {name: 'Swansea City'},
        {name: 'West Bromwich Albion'},
        {name: 'West Ham United'},
    ]).success(next).error(function (err) {
        console.log(err);
    });
}
