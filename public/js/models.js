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
    this.local = this.moment.time.local().toDate();
    this.day = this.moment.time.format('YYYY-MM-DD');
}


function Bet(data) {
    for (var key in data) {
        this[key] = data[key];
    }
    this.user = this.User;
}

Bet.prototype.isPerfect = function () {
    return this.type === 'perfect';
};

Bet.prototype.isWin = function () {
    return this.type === 'win';
};

Bet.prototype.isLost = function () {
    return this.type === 'loss';
};

Bet.prototype.cssClass = function () {
    var classes = [];
    classes.push(this.type);
    return classes.join(', ');
};

