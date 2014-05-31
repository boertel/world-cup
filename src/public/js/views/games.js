GameView = Backbone.View.extend({
    template: Handlebars.compile($('#game-template').html()),
    model: Game,
    initialize: function () {
        this.render();
    },
    render: function () {
        this.$el.html(this.template(this.model));
    }
});

GamesListView = Backbone.View.extend({
    tagName: 'ul',
    initialize: function () {

        this.render();
    },
    render: function () {
        this.$el.html('');
        this.collection.each(this.renderGame, this);
    },
    renderGame: function () {
        this.$el.append(new GameView({
            tagName: 'li',
            model: Game
        }).el);
    }
});

GamesView = Backbone.View.extend({
    initialize: function () {
        this.collection = new GamesCollection(
            [
                {'name': 'a'},
                {'name': 'b'},
            ]
        );
        this.render();

        new GamesListView({
            el: this.$('ul.games'),
            collection: this.collection
        });
    },
    render: function () {
        this.$el.html('<ul class="games"></ul>');
    }
});
