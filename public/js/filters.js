app.filter('groupBy', ['$parse', function ($parse) {
    return function (list, group_by) {
        var filtered = [],
            previous,
            getter = $parse(group_by);

        angular.forEach(list, function (each) {
            var group_key = getter(each);

            if (previous != group_key) {
                previous = group_key;
                each.separator = true;
            }
            filtered.push(each);
        });

        return filtered;
    };
}]);
