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
            attrs: function () {
                var attributes = [],
                    not = ['created_at', 'updated_at', 'game_id']
                for (var key in this.attributes) {
                    if (not.indexOf(key) === -1) {
                        attributes.push(key)
                    }
                }
                return attributes
            },
            associate: function (models) {
                Bet.belongsTo(models.Game)
                Bet.belongsTo(models.User)
            }
        }
    })

    return Bet
}
