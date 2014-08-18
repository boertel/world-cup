# Installation

### Requirements
1. Database is hosted on postgres
2. Sessions are stored in Redis
3. Server is running with node

No instructions, just google it.


### Data
To insert the data in postgres, run:
```node seed/init.js``` (in dev, it's dropping the database every time, you run the command).

### Authentication
It's using Facebook login, there is only one app for dev & prod, and you need to run your local server on [http://foot.local/]()


# Run

I'm using *nodemon* package to run the server locally: ```nodemon app.js```

On the front-end, it's using ```angular```.


# Commands

To update points for users (in both your database and for facebook leaderboard), you need to:

1. Update the match scores
2. Run ```node commands/update_score.js```

(It's flagging each bet as *validated*, so it's only computing new matches)


# Improvements

It's definetily not optimized and not consistent (api responses return ```[{game: {id:1, bet: {...}}]``` and sometimes ```[{bet: {id: 1, game: {...}}]``` and probably even worst things).

* There is models relationships where I can't get the reverse foreign key for some reasons.
* Clean up api responses
* Better ```update_scores.js``` command: group by users, so we do only 1 api call to facebook
* don't use ```jade``` for the node templating engine, it's messy with angular and when need to do quick fix (google analytics, common angular templates)
* minify and merge the assets


# Links

Stack:

- http://developers.soundcloud.com/blog/building-the-next-soundcloud/#comments
- http://futuredarrell.github.io/webshaped-2013/#/
- http://strava.github.io/api/

UI:

- https://readmill.com/epilogue
- https://variancecharts.com/
- https://www.quora.com/Color-and-Colors/Is-there-a-science-to-picking-colors-that-work-well-together-or-is-it-just-subjective

Library:

- http://kenwheeler.github.io/slick/

