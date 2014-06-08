app.filter('groupBy', ['$parse', function ($parse) {
    return function (list, group_by) {
        var filtered = {},
            getter = $parse(group_by);

        angular.forEach(list, function (each) {
            var group_key = getter(each);
            filtered[group_key] = filtered[group_key] || [];
            filtered[group_key].push(each);
        });
        console.log(filtered);

        return filtered;
    };
}]);
