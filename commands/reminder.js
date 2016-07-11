var db = require('../models');
var FB = require('fb');
var config = require('../config');
var moment = require('moment');

var sequelize = db.sequelize;
FB.setAccessToken(config.social.facebook.app_access_token);


//var notification = { template: "Don't forget to bet on the Euro 2016 matches" };
//var notification = { template: "Semi finals starts in a few hours! Go fill up the scores. Good luck!"};
var notification = { template: "Final !!!! and it's worth 200 points for a perfect prediction"};


var start = moment.utc();
var end = moment.utc().add(1, 'days');
// select users who haven't bet on a game happening in the next 24 hours
//var query = 'SELECT u.username FROM "User" u WHERE id NOT IN (SELECT b.user_id FROM "Game" g LEFT JOIN "Bet" b ON g.id = b.game_id WHERE time >= :start AND time <= :end GROUP by b.user_id);';
var query = 'SELECT u.username, u.points FROM "User" u WHERE u.points != 0 ORDER BY u.points DESC';

var options = {
    type: sequelize.QueryTypes.SELECT,
};

//console.log('games between: ', start.format(), 'and', end.format());

var index = 0,
    previous = undefined;
sequelize.query(query, options).then(function (users) {
    console.log('# of users:', users.length);
    users.map(function (user) {
        index += 1;
        if (previous !== user.points) {
            rank = index;
        }
        previous = user.points;
        message = 'With ' + user.points + ' points, you ranked #' + rank +  '. Hope you had fun and see you in 2 years for the World Cup ;)';
        FB.api('/' + user.username + '/notifications', 'post', {template: message}, function (response) {
            console.log(user.username, response);
        })
    })
});
