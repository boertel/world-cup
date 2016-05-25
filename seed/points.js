var Points = require('../models').Points;

module.exports = function () {
    return Points.bulkCreate([
        { perfect: 50, win: 30, loss: 0 },
        { perfect: 100, win: 60, loss: 0 },
        { perfect: 150, win: 90, loss: 0 },
    ]);
};
