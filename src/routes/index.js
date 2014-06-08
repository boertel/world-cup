var competitors = require('./competitors.js'),
    groups = require('./groups.js'),
    games = require('./games.js'),
    users = require('./users.js'),
    bets = require('./bets.js'),
    db = require('../models')

module.exports = function (app) {

    app.get('/api/v1/competitors', competitors.read)
    app.get('/api/v1/competitors/:id', competitors.read)

    app.get('/api/v1/groups', groups.read)
    app.get('/api/v1/groups/:id', groups.read)

    app.get('/api/v1/games', games.read)
    app.get('/api/v1/games/:id', games.read)

    app.get('/api/v1/games/:id/bets', bets.read)
    app.post('/api/v1/games/:id/bets', bets.post)
    app.put('/api/v1/bets', bets.put)

    app.get('/api/v1/users/:id', users.profile.read)
    app.get('/api/v1/users/:id/bets', users.bets.read)

    // Views
    app.get('/', function(req, res) {
        if (!req.isAuthenticated()) {
            res.render('index', { title: 'Express'});
        } else {
            res.redirect('/dashboard')
        }
    })

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
