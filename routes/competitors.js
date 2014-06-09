var db = require('../models')


module.exports = {
    read: function (req, res) {
        var filters = {
            attributes: db.Competitor.attrs()
        }
        if (req.params.id) {
            filters.where = {id: req.params.id}
        }
        db.Competitor.findAll(filters).success(function (competitors) {
            if (req.params.id) {
                competitors = competitors[0]
            }
            res.json(competitors)
        })
    }
}
