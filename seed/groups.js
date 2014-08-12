var Group = require('../models').Group

module.exports = function (next) {
    return Group.bulkCreate([
        {name: 'Week 1'},
        {name: 'Week 2'},
        {name: 'Week 3'},
        {name: 'Week 4'},
        {name: 'Week 5'},
        {name: 'Week 6'},
        {name: 'Week 7'},
        {name: 'Week 8'},
        {name: 'Week 9'},
        {name: 'Week 10'},
    ]).success(next)
}
