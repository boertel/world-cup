var db = require('../models');


db.Social.findAll().then(function(socials) {
    socials.forEach(function(social) {
        social.getFriends().then(function(facebookFriends) {
            db.Friend.findAll({where: {user_id: social.user_id}, raw: true, attributes: ['username']}).then(function(friends) {
                friends = friends.map(function(friend) { return friend.username; });
                diff = facebookFriends.filter(function(friend) { return friends.indexOf(friend) === -1 });
                console.log(diff.length, friends.length, facebookFriends.length, social.user_id);
                db.Friend.bulkCreate(diff.map(function(friend) { return { username: friend, user_id: social.user_id} }));
            })
        });
    });
});
