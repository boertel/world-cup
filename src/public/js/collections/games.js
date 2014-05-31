GamesCollection = Backbone.Collection.extend({
    model: Game,
    url: '/api/v1/games'
});
