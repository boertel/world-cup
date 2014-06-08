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
