var express = require('express');
var http = require('http');
var path = require('path');

var db = require('./models');
var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('./config'),
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    raven = require('raven'),
    bodyParser = require('body-parser');

var env = process.env.NODE_ENV || 'development';

var client = new raven.Client(config.sentry);
if (config.sentry) {
    process.on("unhandledRejection", function(reason, promise) {
        client.captureException(reason)
        throw reason;
    })
}

var app = express();

function static(dirname, age) {
    return require('serve-static')(path.join(__dirname, dirname), {maxAge: age});
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


if (config.sentry) {
    // The request handler must be the first item
    app.use(raven.middleware.express.requestHandler(config.sentry));
}

//app.use(require('static-favicon')(__dirname + '/public/favicon.ico'));
app.use(require('morgan')('dev'));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(static('public'));
app.use(static('public/cached', 86400000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('method-override')());
app.enable("trust proxy");
app.use(session({
    store: new RedisStore(config.redis),
    secret: 'elephan7Bleu',
    cookie: { maxAge: (3600000 * 24 * 30) },
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(function (req, res, next) {
    res.locals.user = {}
    if (req.isAuthenticated()) {
        res.locals.user = req.user
    }
    //res.locals.debug = (env !== 'production');
    next()
})

app.param('user', function (req, res, next, id) {
    if (id === 'me') {
        next()
    } else {
        db.User.find(id).then(function (user) {
            req.user = user
            next()
        })
    }
})


passport.serializeUser(db.User.serialize);
passport.deserializeUser(db.User.deserialize);

passport.use(new FacebookStrategy({
    clientID: config.social.facebook.clientID,
    clientSecret: config.social.facebook.clientSecret,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['first_name', 'last_name', 'gender', 'link', 'timezone'],
}, db.User.authenticate))

app.get('/error', function mainHandler(req, res) {
    throw new Error('Broke!');
});

app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_friends',]
}))
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
}))
app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

require('./routes')(app)



if (config.sentry) {
    // The error handler must be before any other error middleware
    app.use(raven.middleware.express.errorHandler(config.sentry));
}

function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry+'\n');
}

if (config.sentry) {
    app.use(onError);
} else {
    app.use(require('errorhandler')());
}

db.sequelize
    .sync({force: false})
    .then(function () {
        http.createServer(app).listen(app.get('port'), function(){
          console.log('Express server listening on port ' + app.get('port'));
        });
    })
    .catch(function (err) {
        throw err;
    });

exports.app = app
