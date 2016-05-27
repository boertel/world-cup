var request = require('request'),
    FB = require('fb'),
    config = require('../config');


module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
            }
        },
        email: {
            type: DataTypes.STRING
        },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        picture: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        gender: DataTypes.STRING,
        timezone: DataTypes.INTEGER,
        link: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        points: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    }, {
        instanceMethods: {
            publishScore: function (next) {
                var access_token = config.social.facebook.app_access_token
                FB.setAccessToken(access_token);

                var uid = this.username,
                    data = {
                        score: this.points
                    };
                FB.api('/' + uid + '/scores', 'post', data, function (response) {
                    return next(response);
                })
            },
            toJSON: function () {
                var json = this.get();
                json.name = this.first_name + ' ' + this.last_name;
                return json;
            }
        },
        classMethods: {
            attrs: function () {
                var attributes = [],
                    not = ['created_at', 'updated_at', 'email'];
                for (var key in this.attributes) {
                    if (not.indexOf(key) === -1) {
                        attributes.push(key);
                    }
                }
                return attributes;
            },
            associate: function (models) {
                User.hasMany(models.Bet);
            },
            serialize: function (user, done) {
                done(null, user.id)
            },
            deserialize: function (id, done) {
                return User.find({where: {id: id}}).then(function (user) {
                    done(null, user);
                });
            },
            authenticate: function (accessToken, refreshToken, profile, done) {
                var find = {username: profile.id},
                    create = {
                        first_name: profile.name.givenName,
                        last_name: profile.name.familyName,
                        email: '',
                        gender: profile.gender,
                        timezone: profile._json.timezone,
                        link: profile._json.link
                    };

                if (profile.emails) {
                    if  (profile.emails.length > 0) {
                        create.email = profile.emails[0].value;
                    }
                }
                User.findOrCreate({where: find, defaults: create}).spread(function (user, created) {
                    var db = require('../models');
                    var where = {provider: 'facebook', uid: find.username, user_id: user.id},
                        defaults = { credentials: JSON.stringify({access_token: accessToken}) };
                    db.Social.findOrCreate({where: where, defaults: defaults}).spread(function (social, created) {
                        social.setUser(user) // FIXME check incomplete
                        if (!user.picture) {
                            var url = 'https://graph.facebook.com/me/picture?redirect=false&access_token=' + accessToken
                            request.get(url, function (error, response, body) {
                                var json = JSON.parse(body);
                                    user.picture = json.data.url
                                    user.save()
                            })
                        }
                        done(null, user)
                    })
                })
            }
        }
    })

    return User
}
