module.exports = {
    database: 'postgres://ben@localhost:5432/worldcup',
    redis: {
        host: "localhost",
        port: "6379",
        ttl: 1296000
    },
    utils: {
        raven: {
            url: "https://d121e324c60f455e86d9ffe47b048304:2883319b17c643df92dd5a0b6ddbce90@app.getsentry.com/118"
        }
    }
}
