function Game(data) {
    for (var key in data) {
        this[key] = data[key];
    }
    if (this.score_a !== null && this.score_b !== null) {
        this.hasScore = true;
    }
    this.score_a = this.score_a || 0;
    this.score_b = this.score_b || 0;

    this.moment = {
        time: moment.utc(this.time),
        end: moment.utc(this.end),
        deadline: moment.utc(this.deadline)
    };
    var now = new Date();
    this.daysLeft = this.moment.time.local().diff(now, 'days');
    this.day = this.moment.time.format('YYYY-MM-DD');

    this.timeHuman = this.moment.time.local().format('LLLL');
}
