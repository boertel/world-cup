var config = require('../config');

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
            next: function () {
                return Game.find({where: {number: this.number + 1}});
            },
            deadline: function () {
                return new Date(this.time.getTime() - 15 * 60000)
            },
            lock: function () {
                return this.deadline() <= new Date()
            },
            end: function () {
                return new Date(this.time.getTime() + 120 * 60000)
            },
            status: function () {
                if (this.end() > new Date()) {
                    text = 'ended';
                }
                if (this.deadline() >= new Date() && new Date <= this.end()) {
                    text = 'ongoing';
                }
                if (this.deadline() < new Date()) {
                    text = 'scheduled';
                }
                return text;
            },
            toJSON: function () {
                var json = this.get({plain: true});
                json.lock = this.lock();
                json.deadline = this.deadline();
                json.end = this.end();
                json.status = this.status();
                return json;
            }
        },
        classMethods: {
            attrs: function () {
                var attributes = [],
                    not = ['created_at', 'updated_at', 'competitor_a_id', 'competitor_b_id']
                for (var key in this.attributes) {
                    if (not.indexOf(key) === -1) {
                        attributes.push(key)
                    }
                }
                return attributes
            },
            associate: function (models) {
                Game.belongsTo(models.Competitor, {foreignKey: 'competitor_a_id', as: 'competitor_a'})
                Game.belongsTo(models.Competitor, {foreignKey: 'competitor_b_id', as: 'competitor_b'})
                Game.belongsTo(models.Group, { as: 'group' });
            }
        }
    })

    return Game
}
