var Group = require('../models').Group

module.exports = function (next) {
    return Group.bulkCreate([
        {name: 'Group A'},
        {name: 'Group B'},
        {name: 'Group C'},
        {name: 'Group D'},
        {name: 'Group E'},
        {name: 'Group F'},
        {name: 'Group G'},
        {name: 'Group H'}
    ]).success(next)
}
