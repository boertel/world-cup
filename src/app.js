var express = require('express');
var http = require('http');
var path = require('path');

var db = require('./models');
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('./config'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session);


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(require('static-favicon')(__dirname + '/public/favicon.ico'));
app.use(require('morgan')('dev'));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(require('serve-static')(path.join(__dirname, 'public')));
app.use(require('body-parser')());
app.use(require('method-override')());
app.use(require('cookie-parser')());
app.use(session({
    store: new RedisStore(config.session.redis),
    secret: 'elephan7Bleu'
}));
app.use(passport.initialize());
app.use(passport.session());

var env = process.env.NODE_ENV || 'development';
if (env === 'prod') {
    app.use(raven.middleware.express(config.utils.raven.url));
}

app.use(function (req, res, next) {
    res.locals.user = {}
    if (req.isAuthenticated()) {
        res.locals.user = req.user
    }
    next()
})

app.param('user', function (req, res, next, id) {
    if (id === 'me') {
        next()
    } else {
        db.User.find(id).success(function (user) {
            req.user = user
            next()
        })
    }
})


// development only
if ('development' == app.get('env')) {
    app.use(require('errorhandler')());
}

passport.serializeUser(db.User.serialize);
passport.deserializeUser(db.User.deserialize);

passport.use(new FacebookStrategy({
    clientID: config.social.facebook.clientID,
    clientSecret: config.social.facebook.clientSecret,
    callbackURL: '/auth/facebook/callback'
}, db.User.authenticate))




app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}))
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

require('./routes')(app)

db.sequelize
    .sync({force: false})
    .complete(function (err) {
        if (err) {
            throw err;
        } else {
            http.createServer(app).listen(app.get('port'), function(){
              console.log('Express server listening on port ' + app.get('port'));
            });
        }
    })

exports.app = app
