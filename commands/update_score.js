var db = require('../models');


db.Bet.findAll({
    where: {
        validated: false,
    },
    include: [
        {
            model: db.Game,
            where: {
                score_a: {ne: null},
                score_b: {ne: null}
            }
        },
        {
            model: db.User,
            attributes: db.User.attrs(),
        }
    ]
}).success(function (bets) {
    console.log("number of bets to process: ", bets.length);
    bets.forEach(function (bet) {
        console.log("bet: ", bet.id);
        var points = bet.user.points + bet.points();

        db.User.update(
            {points: points},
            {id: bet.user.id}
        ).success(function () {
           bet.user.publishScore(function (response) {
               if (response) {
                   db.Bet.update(
                        {validated: true},
                        {id: bet.id}
                    ).success(function () {
                        console.log("bet saved (" + bet.id + ")");
                    }).error(function (err) {
                        console.log('[bet:update]', err);
                    });
               } else {
                   console.log('[fb:scores', response);
               }
           });
        }).error(function (err) {
            console.log('[user:update]', err);
        })

    });
});
