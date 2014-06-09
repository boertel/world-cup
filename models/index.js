var fs = require('fs'),
    config = require('../config'),
    path = require('path'),
    Sequelize = require('sequelize'),
    lodash = require('lodash'),
    sequelize = new Sequelize(config.database.name, config.database.user, null, {
        dialect: config.database.driver,
        port: 5432,
        define: {
            underscored: true,
            freezeTableName: true,
        },
        logging: false
    }),
    db = {}

fs.readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach(function (file) {
        var model = sequelize.import(path.join(__dirname, file))
        db[model.name] = model
    })

Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db)
    }
})

module.exports = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db)
