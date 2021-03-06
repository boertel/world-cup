var fs = require('fs'),
    config = require('../config'),
    path = require('path'),
    Sequelize = require('sequelize'),
    _ = require('lodash');


var sequelize = new Sequelize(config.database, {
    define: {
        underscored: true,
        freezeTableName: true,
    },
    dialectOptions: {
        ssl: process.env.NODE_ENV === 'production'
    },
    logging: false
});
var db = {};

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

module.exports = _.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db)
