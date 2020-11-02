const expect = require('chai').expect

const validator = require('../../modules/user_validator')

const { nonExistEmail } = require('../utility')

//MIDDLEWARE 1 `validator
//@ROLE 
// 1. check if all fields are present
// 2. create new fields for `seller` user, and 
// no new fields for `customer` user
// also check if request is for `admin` account
//@SUCCESS `req.newUser` is not empty
//@FAILURE `res.status` called

describe('`validator()', function () {

    //@SUCCESS

    //dummy user
    let userTemplate = {
        email: nonExistEmail,
        username: "TestUser",
        password: "one two three",
        gender: "Male",
        address: "testville",
        user_type: ""
    }

    //for a CUSTOMER account
    describe("Customer account", function () {
        let customer = { ...userTemplate }
        customer['user_type'] = "customer"

        //@SUCEESS
        it("should return user with `customer` fields", function (done) {

            let req = {
                body: customer
            }

            let res = {
                status: function (code) {
                    done(new Error)
                }
            }
            validator(req, res, function () {
                customer['date'] = ""
                expect(req.newUser).to.be.exist
                expect(req.newUser).to.be.an('object')
                expect(req.newUser).to.have.all.keys(customer)
                done()
            })
        })

        //@FAILURE 
        it("should throw `fields do not match`, EXTRA FIELD", function (done) {
            customer['extra'] = "i am extra"
            let req = {
                body: customer
            }

            let res = {
                status: function (code) {
                    return this
                },
                json: function (data) {
                    expect(data.message).to.be.equal("fields do not match")
                    done()
                }
            }

            validator(req, res, function () {
                expect(req.newUser).not.to.be.exist
                done()
            })
        })
    })

    //for SELLER account
    describe("Seller account", function () {

        //@SUCCESS
        it("should return user with 'seller' fields", function (done) {
            let seller = { ...userTemplate }

            seller['user_type'] = "seller"
            seller['brandName'] = ""

            let req = {
                body: seller
            }

            let res = {
                status: function (code) {
                    done(new Error)
                }
            }

            validator(req, res, function () {
                //keys that will be set internally by middleware
                seller['date'] = ""
                seller['products'] = []
                expect(req.newUser).to.be.exist
                expect(req.newUser).to.be.an('object')
                expect(req.newUser).to.have.all.keys(seller)
                done()
            })
        })

        //@FAILURE
        it("should throw `fields do not match`", function (done) {
            let seller = { ...userTemplate }

            seller['user_type'] = "seller"

            let req = {
                body: seller
            }

            let res = {
                status: function (code) {
                    done()
                }
            }


            validator(req, res, function () {
                expect(req.newUser).not.to.exist
                done()
            })
        })
    })

    //when user type is admin or something else
    it("should throw `unknown user cant be added`,`user_type = admin`", function (done) {
        let seller = { ...userTemplate }

        seller['user_type'] = "admin"

        let req = {
            body: seller
        }

        let res = {
            status: function (code) {
                return this
            },
            json: function (data) {
                expect(data.message).to.be.equal(`unknown user cant be added`)
                done()
            }
        }

        validator(req, res, function () {
            expect(req.newUser).not.to.exist
            done()
        })
    })
})