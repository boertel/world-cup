var Group = require('../models').Group

module.exports = function () {
    return Group.bulkCreate([
        {name: 'Group A', point_id: 1},
        {name: 'Group B', point_id: 1},
        {name: 'Group C', point_id: 1},
        {name: 'Group D', point_id: 1},
        {name: 'Group E', point_id: 1},
        {name: 'Group F', point_id: 1},
        {name: 'Group G', point_id: 1},
        {name: 'Group H', point_id: 1},
        {name: 'Round of 16', point_id: 2},
        {name: 'Quarter Finals', point_id: 2},
        {name: 'Semi Finals', point_id: 2},
        {name: 'Play-off for third place', point_id: 2},
        {name: 'Final', point_id: 3}
    ]);
}
