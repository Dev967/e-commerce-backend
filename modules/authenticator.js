const {client} = require('./mongo_connection')
const bcrypt = require('bcrypt')
const isEmpty = require('./isEmpty')
const { ObjectId } = require('mongodb')

const users = client.db(process.env.DB_NAME).collection('users')

//@MIDDLEWARE login
//@DESC to authenticate user given login details
//@USE Router.post('/login',checkNotAuth,login)
const login = (req, res, next) => {
    // const email = req.fields.email
    // const password = req.fields.password
    const email = req.body.email
    const password = req.body.password

    users.findOne({
        "email": email
    },
        async (err, result) => {
            if (err) res.redirect(process.env.failureRedirect)
            else if (!result) res.redirect(process.env.failureRedirect)
            else if (await bcrypt.compare(password, result.password) === false) res.redirect(process.env.failureRedirect)
            else {
                //enter user id to session
                req.session.user = { userID: result._id }
                res.redirect(process.env.successRedirect)
            }
        })
}

//@MIDDLEWARE logout
//@DESC to unpopulate req.user and req.session.user
//@USE Router.get('/logout',checkAuth,logout)
const logout = (req, res, next) => {
    req.session.user = {}
    req.user = {}
    res.redirect(process.env.failureRedirect)
}

//@MIDDLEWARE authenticator
//@DESC populate req.user every time
//@USE app.use(authenticator)
const authenticator = (req, res, next) => {
    if (!isEmpty(req.session.user)) {
        users.findOne({
            "_id": ObjectId(req.session.user.userID)
        },
            (err, result) => {
                if (err) req.session.user = {}
                else {
                    req.user = result
                    next()
                }
            }
        )
    } else next()
}

module.exports = {
    login,
    logout,
    authenticator
}
