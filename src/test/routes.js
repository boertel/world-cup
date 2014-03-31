var should = require('should'),
    request = require('supertest'),
    assert = require('assert'),
    app = require('../app').app,
    db = require('../models')


describe('Routing', function () {
    before(function (done) {
        db.sequelize.drop().success(function () {
            db.sequelize.sync({force: true}).success(function () {
                done()
            })
        })
    })

    describe('User', function () {
        before(function (done) {
            db.User.create({
                id: 1,
                username: 'test',
                email: 'test@example.com'
            }).success(function (user) {
                done()
            })
        })

        after(function (done) {
            db.User.destroy({}, {truncate: true}).success(function () {
                done()
            })
        })

        it('should return a valid user', function (done) {
            request(app)
                .get('/api/v1/users/1')
                .expect(200)
                .end(function (err, res) {
                    res.body.id.should.equal(1)
                    res.body.email.should.equal('test@example.com')
                    done()
                })
        })
    })

    describe('Group', function () {
        before(function (done) {
            db.Group.create({
                name: 'A'
            }).success(function () {
                done()
            })
        })

        after(function (done) {
            done()
        })

        it('should a one group', function (done) {
            request(app)
                .get('/api/v1/groups')
                .expect(200)
                .end(function (err, res) {
                    res.body.length.should.equal(1)
                    done()
                })
        })
    })

    describe('Competitor', function () {
        before(function (done) {
            db.Competitor.bulkCreate([
                {name: 'France'},
                {name: 'Brazil'},
            ]).success(function () {
                db.Group.create({
                    name: 'A'
                }).success(function () {
                    done()
                })
            })
        })

        after(function (done) {
            done()
        })

        it('should return a list of competitors', function (done) {
            request(app)
                .get('/api/v1/competitors')
                .expect(200)
                .end(function (err, res) {
                    res.body.length.should.equal(2)
                    done()
                })
        })
    })
})
