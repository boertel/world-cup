var config = require('../config');

module.exports = function (sequelize, DataTypes) {
    var Bet = sequelize.define('Bet', {
        score_a: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                isInt: true,
                min: 0
            }
        },
        score_b: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                isInt: true,
                min: 0
            }
        },
        validated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        instanceMethods: {
            perfect: function () {
                return this.game.score_a === this.score_a &&
                       this.game.score_b === this.score_b
            },
            win: function () {
                /* Team A won
                 * Tie
                 * Team B won
                 */
                return (this.game.score_a > this.game.score_b && this.score_a > this.score_b)
                    || (this.game.score_a === this.game.score_b && this.score_a === this.score_b)
                    || (this.game.score_a < this.game.score_b && this.score_a < this.score_b)
            },
            points: function () {
                if (!this.game) {
                    return
                }
                var gamePoints = this.game.points();
                if (this.game.score_a === null || this.game.score_b === null ||
                    this.score_a === null || this.score_b === null) {
                    return;
                }
                if (this.perfect()) {
                    return gamePoints.perfect;
                }
                if (this.win()) {
                    return gamePoints.win;
                }
                return gamePoints.lost;
            },
            toJSON: function () {
                var json = this.values;
                json.points = this.points();
                return json;
            }
        },
        classMethods: {
            attrs: function () {
                var attributes = [],
                    not = ['updated_at', 'game_id']
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
