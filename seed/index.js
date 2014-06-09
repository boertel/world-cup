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

db.sequelize.drop()
    .success(function () {
        db.sequelize
            .sync({force: true})
            .complete(function (err) {
                if (err) {
                    throw err
                } else {
                    populateDatabase()
                }
            })
    })
