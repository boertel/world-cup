var db = require('../models')


module.exports = {
    read: function (req, res) {
        var filters = {
            attributes: db.Group.attrs(),
            include: [
                {
                    model: db.Game,
                    attributes: db.Game.attrs(),
                    include:[
                        {
                            model: db.Competitor,
                            as: 'competitor_a',
                            attributes: db.Competitor.attrs()
                        },
                        {
                            model: db.Competitor,
                            as: 'competitor_b',
                            attributes: db.Competitor.attrs()
                        }
                    ]
                }
            ]
        }
        if (req.params.id) {
            filters.where = {id: req.params.id}
        }
        db.Group.findAll(filters).success(function (groups) {
            res.json(groups)
        })
    }
}
