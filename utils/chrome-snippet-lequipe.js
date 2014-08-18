var MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
    "août", "septembre", "octobre", "novembre", "décembre"],
    TEAMS = {
        "Arsenal": "Arsenal FC",
        "Burnley": "Burnley FC",
        "Chelsea": "Chelsea FC",
        "Everton": "Everton FC",
        "Liverpool": "Liverpool FC",
        "Southampton": "Southampton FC",
        "Sunderland": "Sunderland AFC",
        "Queens Park Rangers": "QPR",
        "West Ham Utd": "West Ham United",
    };

function extractDate(str) {
    var split = str.split(" "),
        day = split[1],
        month = MONTHS.indexOf(split[2]),
        year = split[3];
    return [year, (month < 10) ? "0" + month : month, day].join('-');
}


function convertTeam(name) {
    return TEAMS[name] ? TEAMS[name] : name;
}

function extractMatch(node, date) {
    var match = node,
        home = match.find('.equipeDom img').attr('alt'),
        away = match.find('.equipeExt img').attr('alt'),
        time = match.find('.score a').text().replace('h', ':');

    return {
        home: convertTeam(home),
        away: convertTeam(away),
        date: extractDate(date),
        group: group,
        time: time,
    };
}

var date, group, matches = [];

$('#CONT > div').children().each(function () {
    var node = $(this);

    if (node.hasClass('date-event')) {
        date = node.text().trim();
    }
    if (node.hasClass('ligne') && node.hasClass('off')) {
        group = parseInt(node.find('.intitule').text());
    }
    if (node.hasClass('ligne') && node.hasClass('bb-color')) {
        matches.push(extractMatch(node, date, group));
    }

});

var output = '',
    i = (group - 1) * 10;
matches.forEach(function (m) {
    i += 1;
    output += "addGame(" + i + ", '" + m.date + " " + m.time + "', '" + m.home + "', '" + m.away + "', " + group + "),\n";
})

console.log(output);
