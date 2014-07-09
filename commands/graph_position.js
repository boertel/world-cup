var db = require('../models');

db.Bet.findAll({
    where: {
        validated: true,
    },
    include: [
        {
            model: db.Game,
            attributes: db.Game.attrs()
        },
        {
            model: db.User,
            attributes: db.User.attrs()
        }
    ]
}).success(function (bets) {
    output = [];
    bets.forEach(function (bet) {
        output.push({
            user_id: bet.user.id,
            game_id: bet.game.id,
            group_id: bet.game.group_id,
            points: bet.points(),
            time: bet.game.time.toISOString()
        });
    });
    console.log(JSON.stringify(output))
});
