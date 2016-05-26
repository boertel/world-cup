var Competitor = require('../models').Competitor

module.exports = function () {
    return Competitor.bulkCreate([
        {name: 'France'},
        {name: 'Romania'},
        {name: 'Albania'},
        {name: 'Switzerland'},

        {name: 'England'},
        {name: 'Russia'},
        {name: 'Wales'},
        {name: 'Slovakia'},

        {name: 'Germany'},
        {name: 'Ukraine'},
        {name: 'Poland'},
        {name: 'Northern Ireland'},

        {name: 'Spain'},
        {name: 'Czech Republic'},
        {name: 'Turkey'},
        {name: 'Croatia'},

        {name: 'Belgium'},
        {name: 'Italy'},
        {name: 'Republic of Ireland'},
        {name: 'Sweden'},

        {name: 'Portugal'},
        {name: 'Iceland'},
        {name: 'Austria'},
        {name: 'Hungary'},

    ])
}
