app.directive('time', function () {
    return {
        restrict: 'E',
        replace: false,
        template: '{{ output }}',
        link: function (scope, element, attrs) {
            var utc = moment.utc(attrs.datetime),
                local = utc.local();
            scope.output = local.fromNow();
            element.attr('title', local.format('dddd, MMMM Do YYYY, HH:mm'));
        }
    }
});



var directives = [
    'games',
];

function toCamel(str) {
    return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
}

function toDash(str) {
    return str.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
}

angular.forEach(directives, function (value) {
    var name = 'widget' + value.charAt(0).toUpperCase() + toCamel(value.slice(1)),
        url = 'widget-' + value;
    app.directive(name, function () {
        return { templateUrl: url + '.html' };
    });
});
