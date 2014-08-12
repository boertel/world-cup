var Competitor = require('../models').Competitor

module.exports = function (next) {
    return Competitor.bulkCreate([
        {name: 'Arsenal FC'},
        {name: 'Aston Villa'},
        {name: 'Burnley FC'},
        {name: 'Chelsea FC'},
        {name: 'Crystal Palace'},
        {name: 'Everton FC'},
        {name: 'Hull City'},
        {name: 'Leicester City'},
        {name: 'Liverpool FC'},
        {name: 'Manchester City'},
        {name: 'Manchester United'},
        {name: 'Newcastle United'},
        {name: 'QPR'},
        {name: 'Southampton FC'},
        {name: 'Tottenham Hotspur'},
        {name: 'Stoke City'},
        {name: 'Sunderland AFC'},
        {name: 'Swansea City'},
        {name: 'West Bromwich Albion'},
        {name: 'West Ham United'},
    ]).success(next).error(function (err) {
        console.log(err);
    });
}
