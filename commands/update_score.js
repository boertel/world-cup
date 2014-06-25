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
    console.log("Bets: ", bets.length);
    var users = {};

    bets.forEach(function (bet) {
        if (!users[bet.user.id]) {
            users[bet.user.id] = {
                points: 0,
                bets: []
            }
        }
        users[bet.user.id].points += bet.points();
        users[bet.user.id].bets.push(bet.id);
    });

    console.log('Users: ', Object.keys(users).length);
    console.log('---------------------------------');
    for (var user_id in users) {
        db.User.find({where : {id: user_id}}).success(function (user) {
            var points = users[user.id].points;
            user.points += points;
            user.save(['points']).success(function () {
                user.publishScore(function (response) {
                    if (response) {
                        console.log(user.points + '\t\t' +  user.first_name + ' ' + user.last_name);
                    } else {
                        console.log('[fb:scores', response);
                    }
                });
            }).error(function (err) {
                console.log('[user:save]', err);
            });
        }).error(function (err) {
            console.log('[user:find]', err);
        });
    }

    db.Bet.update(
        {validated: true},
        {id: bets.map(function (d) { return d.id; })}
    ).success(function () {
        console.log('bets saved');
    }).error(function (err) {
        console.log('[bets:save]', err);
    });
});
