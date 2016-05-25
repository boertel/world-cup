module.exports = function (sequelize, DataTypes) {
    var Points = sequelize.define('Points', {
        perfect: DataTypes.INTEGER,
        win: DataTypes.INTEGER,
        loss: DataTypes.INTEGER,
    });
    return Points;
}
