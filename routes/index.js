var competitors = require('./competitors.js'),
    groups = require('./groups.js'),
    games = require('./games.js'),
    users = require('./users.js'),
    bets = require('./bets.js'),
    leaderboard = require('./leaderboard.js'),
    notifications = require('./notifications.js'),
    friends = require('./friends.js'),
    social = require('./social.js'),
    db = require('../models')

module.exports = function (app) {

    app.get('/api/v1/competitors', competitors.read)
    app.get('/api/v1/competitors/:id', competitors.read)
    app.get('/api/v1/competitors/:id/games', competitors.games.read)

    app.get('/api/v1/groups', groups.read)
    app.get('/api/v1/groups/:id', groups.read)

    app.get('/api/v1/games', games.read)
    app.get('/api/v1/games/:id', games.read)

    app.get('/api/v1/games/:id/bets', bets.read)
    app.post('/api/v1/games/:id/bets', bets.post)
    app.put('/api/v1/bets', bets.put)

    app.get('/api/v1/users/:id', users.profile.read)
    app.get('/api/v1/users/:id/bets', users.bets.read)
    app.post('/api/v1/users/:id/points', users.points.post)

    app.get('/api/v1/friends', friends.read)
    app.post('/api/v1/social', social.post)

    app.get('/api/v1/leaderboard', leaderboard.read)

    app.get('/api/v1/notifications', notifications.read)

    // Views
    function indexView(req, res) {
        if (!req.isAuthenticated()) {
            res.render('index');
        } else {
            res.redirect('/dashboard')
        }
    }
    app.get('/', indexView)
    app.post('/', indexView)

    app.get('/login', function (req, res) {
        res.redirect('/')
    })

    var authenticated = function (req, res, next) {
        if (!req.isAuthenticated()) {
            res.redirect('/login')
        }
        next()
    }

    app.get('/dashboard', authenticated, function (req, res) {
        res.render('dashboard')
    })
}
