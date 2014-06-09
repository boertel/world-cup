var Competitor = require('../models').Competitor

module.exports = function (next) {
    return Competitor.bulkCreate([
        {name: 'Brazil'},
        {name: 'Croatia'},
        {name: 'Mexico'},
        {name: 'Cameroon'},

        {name: 'Spain'},
        {name: 'Netherlands'},
        {name: 'Chile'},
        {name: 'Australia'},

        {name: 'Colombia'},
        {name: 'Greece'},
        {name: 'Côte d\'Ivoire'},
        {name: 'Japan'},

        {name: 'Uruguay'},
        {name: 'Costa Rica'},
        {name: 'England'},
        {name: 'Italy'},

        {name: 'Switzerland'},
        {name: 'Ecuador'},
        {name: 'France'},
        {name: 'Honduras'},

        {name: 'Argentina'},
        {name: 'Bosnia and Herzegovina'},
        {name: 'Iran'},
        {name: 'Nigeria'},

        {name: 'Germany'},
        {name: 'Portugal'},
        {name: 'Ghana'},
        {name: 'USA'},

        {name: 'Belgium'},
        {name: 'Algeria'},
        {name: 'Russia'},
        {name: 'Korea Republic'}
    ]).success(next)
}
