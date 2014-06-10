function Game(data) {
    for (var key in data) {
        this[key] = data[key];
    }
    this.score_a = this.score_a || 0;
    this.score_b = this.score_b || 0;

    this.moment = {
        time: moment.utc(this.time),
        end: moment.utc(this.end),
        deadline: moment.utc(this.deadline)
    };
    var now = new Date();
    this.daysLeft = this.moment.time.diff(now, 'days');

    this.timeHuman = this.moment.time.local().format('LLLL')
}
