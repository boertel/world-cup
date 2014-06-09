module.exports = function (sequelize, DataTypes) {
    var Competitor = sequelize.define('Competitor', {
        name: DataTypes.STRING
    }, {
        classMethods: {
            attrs: function () {
                var attributes = []
                for (var key in this.attributes) {
                    if (['created_at', 'updated_at'].indexOf(key) === -1) {
                        attributes.push(key)
                    }
                }
                return attributes
            }
        }
    })
    return Competitor
}
