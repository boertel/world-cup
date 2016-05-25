var db = require('../models'),
    competitors = require('./competitors'),
    groups = require('./groups'),
    games = require('./games'),
    points = require('./points');


function populateDatabase() {
    return competitors()
        .then(points)
        .then(groups)
        .then(games);
}

function insert() {
    return db.sequelize
        .sync({force: true})
        .then(populateDatabase)
        .catch(function (err) {
            throw err
        });
}


if (process.env.NODE_ENV === 'prod') {
    insert();
} else {
    db.sequelize.drop().then(insert);
}
