Router = Backbone.Router.extend({
    routes: {
        'dashboard': 'gamesIndex',
        'game': 'gameIndex'
    },
    gamesIndex: function () {
        new GamesView({el: '#content'});
    },
    gameIndex: function () {
        new GameView({el: '#content'});
    },
});
