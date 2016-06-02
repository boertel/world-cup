var Promise = require('bluebird');
var FB = require('fb');
var request = require('request');
var config = require('../config');


module.exports = function (sequelize, DataTypes) {
    var Social = sequelize.define('Social', {
        provider: {
            type: DataTypes.STRING
        },
        uid: {
            type: DataTypes.STRING
        },
        credentials: {
            type: DataTypes.STRING(1024)
        }
    }, {
        instanceMethods: {
            getAvatar: function() {
                var url = 'https://graph.facebook.com/me/picture?redirect=false&access_token=' + this.getAccessToken();
                return new Promise(function (resolve) {
                    request.get(url, function (error, response, body) {
                        var json = JSON.parse(body);
                        resolve(json.data.url)
                    })
                });
            },
            getAccessToken: function() {
                return JSON.parse(this.credentials).access_token;
            },
            getFriends: function() {
                var userId = this.user_id;
                FB.setAccessToken(this.getAccessToken());
                return new Promise(function(resolve, reject) {
                    FB.api('/' + config.social.facebook.clientID, 'GET', {fields: 'context{friends_using_app.limit(100)}'}, function(response) {
                        if (!response || response.error) {
                            reject(response.error);
                        } else {
                            var context = response.context;
                            if (context && context.friends_using_app) {
                                var friends = context.friends_using_app.data.map(function(friend) {
                                    return friend.id;
                                })
                                resolve(friends);
                            }
                        }
                    });
                });
            }
        },
        classMethods: {
            associate: function (models) {
                Social.belongsTo(models.User, { as: 'user' })
            }
        }
    })
    return Social
}
