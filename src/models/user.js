var db = require('../models'),
    request = require('request')


module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            }
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
        }
    }, {
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
                User.find({where: {id: id}}).complete(done)
            },
            authenticate: function (accessToken, refreshToken, profile, done) {
                var find = {username: profile.id},
                    create = {
                        first_name: profile.name.givenName,
                        last_name: profile.name.familyName,
                        email: profile.emails[0].value,
                        gender: profile.gender,
                        timezone: profile._json.timezone,
                        link: profile._json.link
                    }
                User.findOrCreate(find, create).success(function (user, created) {
                    var db = require('../models')
                    db.Social.findOrCreate({provider: 'facebook', uid: find.username, user_id: user.id}, {
                        credentials: JSON.stringify({access_token: accessToken})}).success(function (social, created) {
                            social.setUser(user) // FIXME check incomplete
                            var url = 'https://graph.facebook.com/me/picture?redirect=false&access_token=' + accessToken
                            request.get(url, function (error, response, body) {
                                var json = JSON.parse(body);
                                    user.picture = json.data.url
                                    user.save()
                            })
                            done(null, user)
                        }).error(function (err) {
                            done(err)
                        })
                }).error(function (err) {
                    done(err)
                })
            }
        }
    })

    return User
}
