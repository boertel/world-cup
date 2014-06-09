module.exports = function (sequelize, DataTypes) {
    var Social = sequelize.define('Social', {
        provider: {
            type: DataTypes.STRING
        },
        uid: {
            type: DataTypes.STRING
        },
        credentials: {
            type: DataTypes.STRING(1024)
        }
    }, {
        classMethods: {
            associate: function (models) {
                Social.belongsTo(models.User)
            }
        }
    })
    return Social
}
