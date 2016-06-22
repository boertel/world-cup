var db = require('../models');
var FB = require('fb');
var config = require('../config');
var moment = require('moment');

var sequelize = db.sequelize;
FB.setAccessToken(config.social.facebook.app_access_token);


//var notification = { template: "Don't forget to bet on the Euro 2016 matches" };
var notification = { template: "Round of 16 starts this weekend! Go fill up the scores. Good luck!"};

var start = moment.utc();
var end = moment.utc().add(1, 'days');
// select users who haven't bet on a game happening in the next 24 hours
//var query = 'SELECT u.username FROM "User" u WHERE id NOT IN (SELECT b.user_id FROM "Game" g LEFT JOIN "Bet" b ON g.id = b.game_id WHERE time >= :start AND time <= :end GROUP by b.user_id);';
var query = 'SELECT u.username FROM "User" u';

var options = {
    type: sequelize.QueryTypes.SELECT,
};

//console.log('games between: ', start.format(), 'and', end.format());

sequelize.query(query, options).then(function (users) {
    console.log('# of users:', users.length);
    users.map(function (user) {
        FB.api('/' + user.username + '/notifications', 'post', notification, function (response) {
            console.log(user.username, response);
        })
    })
});
