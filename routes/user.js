//modules

const { checkNotAuth, checkAuth } = require('../modules/authHandler')
const { client } = require('../modules/mongo_connection')
const { login, logout } = require('../modules/authenticator')
const bcrypt = require('bcrypt')
const Router = require('express').Router()
const path = require('path')

//collection
const users = client.db(process.env.DB_NAME).collection('users')

//ROUTES

//@route GET user/login
//@desc dummy route for GET on login
Router.route('/login').get((req, res) => res.sendFile(path.join(__dirname, '../files/login.html')))

//@route GET user/userDetails
//@desc route to get user details. Dummy helper route
Router.route('/userDetails').get(checkAuth, (req, res) => res.send(req.user))

//@route POST /user/login
//@desc route to login user
Router.route('/login').post(
    checkNotAuth,
    login)

//@route GET /user/logout
//@desc to logout users
Router.get('/logout', checkAuth, logout)

//@route POST /user/register
//@desc route to register user
Router.route('/register').post(
    checkNotAuth,
    (req, res) => {
        users.findOne({ "email": req.body.email },
            async (err, result) => {
                if (err) {
                    return console.log("error occured", err)
                }
                if (result) {
                    return res.status(400)
                        .json(
                            {
                                success: false,
                                message: "user already exist"
                            })
                }
                try {
                    await users.insertOne({
                        "email": req.body.email,
                        "username": req.body.username,
                        "password": await bcrypt.hash(req.body.password, 5),
                        "gender": req.body.gender,
                        "date": new Date(Date.now()),
                        "address": req.body.address,
                        "type": req.body.user_type
                    })
                    res.redirect(process.env.successRedirect)
                } catch (error) {
                    console.log("error inserting user", error)
                    return res.json({ success: false, message: error })
                }

            })
    }
)

module.exports = Router;