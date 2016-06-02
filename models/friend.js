module.exports = function(sequelize, DataTypes) {
    var Friend = sequelize.define('Friend', {
        username: {
            type: DataTypes.STRING,
            unique: 'compositeFriendIndex',
        },
        user_id: {
            type: DataTypes.INTEGER,
            unique: 'compositeFriendIndex',
        }
    }, {
        classMethods: {
            associate: function(models) {
                Friend.belongsTo(models.User, { as: 'user' });
            }
        }
    });
    return Friend;
}
