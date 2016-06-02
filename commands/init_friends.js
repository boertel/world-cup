var db = require('../models');


db.Social.findAll().then(function(socials) {
    socials.forEach(function(social) {
        social.getFriends().then(function(friends) {
            console.log(friends.length, social.user_id);
            db.Friend.bulkCreate(friends.map(function(friend) { return { username: friend, user_id: social.user_id} }));
        });
    });
});
