_.extend(Backbone.Model.prototype, {
    // Version of toJSON that traverses nested models
    deepToJSON: function() {
        var obj = this.toJSON();
        _.each(_.keys(obj), function(key) {
            if (!_.isNull(obj[key]) && _.isFunction(obj[key].deepToJSON)) {
                obj[key] = obj[key].deepToJSON();
            }
        });
        return obj;
    }
});

_.extend(Backbone.Collection.prototype, {
    // Version of toJSON that traverses nested models
    deepToJSON: function() {
        return this.map(function(model){ return model.deepToJSON(); });
    }
});

_.extend(Backbone.Model.prototype, {
    parse: function (response) {
        for (var key in this.model) {
            var embeddedClass = this.model[key].model,
                embeddedList = this.model[key].collection,
                embeddedData = response[key];

            if (embeddedData) {
                response[key] = new embeddedClass(response[key], {parse: true});
                embeddedList.add(response[key]);
            }
        }
        return response;
    }
});


// Register the partials of the pages
$("script[type='text/x-handlebars-template']").each(function () {
    Handlebars.registerPartial($(this).attr("id"), $(this).html());
});

var Group = Backbone.Model.extend({
});

var Competitor = Backbone.Model.extend({
});

var GroupList = Backbone.Collection.extend({
        model: Group,
        url: '/api/v1/groups'
    }),
    CompetitorList = Backbone.Collection.extend({
        model: Competitor,
        url: '/api/v1/competitors'
    }),
    BetList = Backbone.Collection.extend({
        model: Bet,
        url: '/api/v1/bets'
    });

var Groups = new GroupList(),
    Competitors = new CompetitorList(),
    Bets = new BetList();


var Game = Backbone.Model.extend({
    urlRoot: '/api/v1/games',
    model: {
        group: {
            model: Group,
            collection: Groups
        },
        competitorA: {
            model: Competitor,
            collection: Competitors
        },
        competitorB: {
            model: Competitor,
            collection: Competitors
        }
    },
    initialize: function () {
        var time = moment(this.get('time'));
        this.set('time', time);
        this.set('time_human', time.fromNow());
    }
});

var GameList = Backbone.Collection.extend({
    model: Game,
    url: '/api/v1/games'
});
Games = new GameList();

var Bet = Backbone.Model.extend({
    url: function () {
        return '/api/v1/games/' + this.get('game_id') + '/bets'
    },
    model: {
        game: {
            model: Game,
            collection: Games
        }
    }
});

var BetView = Backbone.View.extend({
    tagName: 'div',
    className: 'bet',
    template: Handlebars.compile($('#bet-template').html()),
    events: {
        'submit form': 'submit',
    },

    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.model.fetch();
    },

    onSuccessSave: function (model, response, options) {
        var notification = new Notification({text: "Your bet has successfully been saved"}),
            notificationView = new NotificationView({
                model: notification
            });
        $("#notification").append(notificationView.render().$el);
    },

    render: function () {
        this.$el.html(this.template(this.model.deepToJSON()));
        $("#content").html(this.$el);
        return this;
    },
    submit: function (e) {
        e.preventDefault();
        var form = this.$el.find('form');
            score_a = form.find('input[name=score_a]').val(),
            score_b = form.find('input[name=score_b]').val();
        var bet = this.model;
        bet.set('game_id', this.model.get('id'));
        bet.set('score_a', parseInt(score_a));
        bet.set('score_b', parseInt(score_b));
        bet.save({}, {
            success: this.onSuccessSave
        });
    }
});

var GameView = Backbone.View.extend({
    tagName: 'li',
    template: Handlebars.compile($('#game-template').html()),
    render: function () {
        this.$el.html(this.template(this.model.deepToJSON()));
        return this;
    }
});

var GamesView = Backbone.View.extend({
    tagName: 'ul',
    initialize: function () {
        this.collection.on('sync', this.render, this);
        this.collection.fetch();
    },
    render: function () {
        this.collection.each(function (game) {
            var gameView = new GameView({model: game});
            this.$el.append(gameView.render().el)
        }, this);
        return this;
    }
});

var Notification = Backbone.Model.extend({
    defaults: {
        text: ""
    }
});

var NotificationList = Backbone.Collection.extend({}),
    Notifications = new NotificationList();

var NotificationView = Backbone.View.extend({
    tagName: 'div',
    attributes: function () {
        return {
            'class': 'notification ' + this.model.get('type')
        }
    },
    template: Handlebars.compile($("#notification-template").html()),
    initialize: function () {
    },
    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var NotificationContainerView = Backbone.View.extend({
    events: {
        'ajaxError': 'ajaxError'
    },
    ajaxError: function (event, request, settings, thrownError) {
        var notification = new Notification({text: request.responseJSON.error, type: 'error'}),
            notificationView = new NotificationView({
                model: notification
            });
        $("#notification").append(notificationView.render().$el);
    }
});


Router = Backbone.Router.extend({
    routes: {
        'games/:id': 'games',
        '*path': 'defaultRoute'
    },
    games: function (id) {
        window.bet = new Bet({
            game_id: id
        });
        new BetView({
            model: bet,
            $el: $('#content')
        });
    },
    defaultRoute: function () {
        var gamesView = new GamesView({
            collection: Games
        });
        $("#content").html(gamesView.render().el);
    }
});

$(document).ready(function () {
    new NotificationContainerView({el: document});
    Backbone.history.start({pushState: false});
});

var App = new Router();
