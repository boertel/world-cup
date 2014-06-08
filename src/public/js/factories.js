app.factory('notification', function () {
    var notifications = [];

    function notify(message, type) {
        type = type || 'success';
        notifications.push({
            message: message,
            type: type
        });
    }

    function get() {
        return notifications;
    }

    return {
        notify: notify,
        get: get
    }
});
