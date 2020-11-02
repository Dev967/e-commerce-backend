//modules

const { checkNotAuth, checkAuth } = require('../modules/authHandler')
const { client } = require('../modules/mongo_connection')
const { login, logout } = require('../modules/authenticator')
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



const validator = require('../modules/user_validator')
const exist = require('../modules/user_exist')
//@route POST /user/register
//@desc route to register user
Router.route('/register').post(
    checkNotAuth,
    exist,
    validator,
    async (req, res) => {
        //upload process starts 
        try {
            //try insertion in db
            await users.insertOne(req.newUser)
            res.redirect(process.env.successRedirect)
        } catch (error) {
            //if insertion failed
            console.log("error adding user", error)
            return res.json({ success: false, message: error })
        }
    }
)

//update and delete routes
module.exports = Router;
