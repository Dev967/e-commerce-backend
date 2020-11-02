const expect = require('chai').expect

const { existEmail, nonExistEmail } = require('../utility')

const exist = require('../../modules/user_exist')


//MIDDLEWARE 0 `exist`
//@ROLE to check if user is already present in db with given email
//@SUCCESS `next` is called
//@FAILURE `res.status` is called
describe("`exist()`", function () {
    //@SUCCESS test
    it("should not throw error", function (done) {
        let req = {
            body: {
                email: nonExistEmail
            }
        }

        let res = {
            status: function (code) {
                let err = new Error
                done(err)
            }
        }

        exist(req, res, function () {
            done()
        })
    })

    //user must be present
    //@FAILURE test
    it("should throw 'user already exist'", function (done) {
        let req = {
            body: {
                email: existEmail
            }
        }
        let res = {
            status: function (code) {
                return this
            },
            json: function (data) {
                expect(data.message).to.be.equal("user already exist")
                done()
            }
        }

        exist(req, res, function () {
            let err = new Error
            done(err)
        })
    })
})