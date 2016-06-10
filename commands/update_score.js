var db = require('../models');


db.Bet.findAll({
    where: {
        validated: false,
    },
    include: [
        {
            model: db.Game,
            as: 'game',
            where: {
                score_a: {ne: null},
                score_b: {ne: null}
            },
            include: [
                {
                    model: db.Group,
                    as: 'group',
                    include: [
                        { model: db.Points, as: 'points', }
                    ]
                }
            ]
        },
        {
            model: db.User,
            attributes: db.User.attrs(),
        }
    ]
}).then(function (bets) {
    console.log("Bets: ", bets.length);
    var users = {};

    bets.forEach(function (bet) {
        if (!users[bet.User.id]) {
            users[bet.User.id] = {
                points: 0,
                bets: []
            }
        }
        var points = bet.game.group.points;
        users[bet.User.id].points += points[bet.getType()];
        users[bet.User.id].bets.push(bet.id);
    });

    console.log('Users: ', Object.keys(users).length);
    console.log('---------------------------------');
    for (var user_id in users) {
        db.User.find({where : {id: user_id}}).then(function (user) {
            var points = users[user.id].points;
            user.points += points;
            user.save(['points'])
                .then(function () {
                    console.log(user.points + '\t\t' +  user.first_name + ' ' + user.last_name);
                })
                .catch(function (err) {
                    console.log('[user:save]', err);
                });
        }).catch(function (err) {
            console.log('[user:find]', err);
        });
    }

    db.Bet.update(
        {validated: true},
        {
            where: {
                id: bets.map(function (d) { return d.id; })
            }
        }
    ).then(function () {
        console.log('bets saved');
    }).catch(function (err) {
        console.log('[bets:save]', err);
    });
});
