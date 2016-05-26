module.exports = function (sequelize, DataTypes) {
    var Group = sequelize.define('Group', {
        name: DataTypes.STRING,
        start: {
            type: DataTypes.DATE,
            validate: {
                isDate: true
            }
        }
    }, {
        classMethods: {
            associate: function (models) {
                Group.hasMany(models.Game);
                Group.belongsTo(models.Points, { as: 'points' });
            },
            attrs: function () {
                return ['id', 'name']
            }
        }
    })
    return Group
}
