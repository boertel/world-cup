module.exports = function (sequelize, DataTypes) {
    var Game = sequelize.define('Game', {
        number: {
            type: DataTypes.INTEGER
        },
        score_a: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true,
                min: 0
            }
        },
        score_b: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: true,
                min: 0
            }
        },
        time: {
            type: DataTypes.DATE,
            validate: {
                isDate: true
            }
        }
    }, {
        instanceMethods: {
            deadline: function () {
                return new Date(this.time - 60 * 60000)
            },
            lock: function () {
                return this.deadline() <= new Date()
            },
            end: function () {
                return new Date(this.time + 90 * 60000)
            },
            toJSON: function () {
                var json = this.values;
                json.lock = this.lock();
                json.deadline = this.deadline();
                json.end = this.end();
                return json;
            }
        },
        classMethods: {
            attrs: function () {
                var attributes = [],
                    not = ['created_at', 'updated_at', 'competitor_a_id', 'competitor_b_id', 'group_id']
                for (var key in this.attributes) {
                    if (not.indexOf(key) === -1) {
                        attributes.push(key)
                    }
                }
                return attributes
            },
            associate: function (models) {
                Game.belongsTo(models.Competitor, {foreignKey: 'competitor_a_id', as: 'competitor_a'})
                    .belongsTo(models.Competitor, {foreignKey: 'competitor_b_id', as: 'competitor_b'})
                    .belongsTo(models.Group)
            }
        }
    })

    return Game
}
