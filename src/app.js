var express = require('express');
var http = require('http');
var path = require('path');

var db = require('./models')
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('./config'),
    RedisStore = require('connect-redis')(express);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    store: new RedisStore(config.session.redis),
    secret: 'elephan7Bleu'
}))
app.use(passport.initialize());
app.use(passport.session());

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

app.use(app.router);


// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
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
