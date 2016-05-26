var Group = require('../models').Group,
    moment = require('moment-timezone');

function convertToUtc(time) {
    var m = moment.tz(time, 'Europe/Paris');
    return m.tz('UTC').format();
}

module.exports = function () {
    return Group.bulkCreate([
        {name: 'Group A', points_id: 1, start: convertToUtc('2016-05-24 00:00:00')},
        {name: 'Group B', points_id: 1, start: convertToUtc('2016-05-24 00:00:00')},
        {name: 'Group C', points_id: 1, start: convertToUtc('2016-05-24 00:00:00')},
        {name: 'Group D', points_id: 1, start: convertToUtc('2016-05-24 00:00:00')},
        {name: 'Group E', points_id: 1, start: convertToUtc('2016-05-24 00:00:00')},
        {name: 'Group F', points_id: 1, start: convertToUtc('2016-05-24 00:00:00')},
        {name: 'Round of 16', points_id: 2, start: convertToUtc('2016-06-24 00:00:00')},
        {name: 'Quarter Finals', points_id: 2, start: convertToUtc('2016-06-28 00:00:00')},
        {name: 'Semi Finals', points_id: 2, start: convertToUtc('2016-07-04 00:00:00')},
        {name: 'Play-off for third place', points_id: 2, start: convertToUtc('2016-07-08 00:00:00')},
        {name: 'Final', points_id: 3, start: convertToUtc('2016-06-24 00:00:00')}
    ]);
}
