module.exports = function (sequelize, DataTypes) {
    var Bet = sequelize.define('Bet', {
        score_a: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: true,
                min: 0
            }
        },
        score_b: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: true,
                min: 0
            }
        }
    }, {
        classMethods: {
            associate: function (models) {
                Bet.belongsTo(models.Game)
                Bet.belongsTo(models.User)
            }
        }
    })

    return Bet
}
