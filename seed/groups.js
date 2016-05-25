var Group = require('../models').Group

module.exports = function () {
    return Group.bulkCreate([
        {name: 'Group A'},
        {name: 'Group B'},
        {name: 'Group C'},
        {name: 'Group D'},
        {name: 'Group E'},
        {name: 'Group F'},
        {name: 'Group G'},
        {name: 'Group H'},
        {name: 'Round of 16'},
        {name: 'Quarter Finals'},
        {name: 'Semi Finals'},
        {name: 'Play-off for third place'},
        {name: 'Final'}
    ]);
}
