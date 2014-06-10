var db = require('../models'),
    competitors = require('./competitors'),
    groups = require('./groups'),
    games = require('./games')


function populateDatabase() {
    competitors(function () {
        groups(function () {
            games(function () {
            })
        })
    })
}

function insert() {
    db.sequelize
        .sync({force: true})
        .complete(function (err) {
            if (err) {
                throw err
            } else {
                populateDatabase()
            }
        })
}

function drop(next) {
    db.sequelize.drop().success(function () {
        next();
    });
}

if (process.env.NODE_ENV === 'prod') {
    insert();
} else {
    drop(insert);
}
