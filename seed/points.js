var Points = require('../models').Points;

module.exports = function () {
    return Points.bulkCreate([
        { perfect: 50, win: 30, loss: 0 },
    ]);
};
