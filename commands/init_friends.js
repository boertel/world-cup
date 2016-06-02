var db = require('../models');
var config = require('../config');

db.Social.findAll().then(function(social) {
    social.getFriends().then(function(friends) {
        console.log(friends.length, social.user_id);
        //db.Friend.bulkCreate(friends.map(function(friend) { return { username: friend, user_id: user.id} }));
    });
});
