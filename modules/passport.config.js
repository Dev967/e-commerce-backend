module.exports = init_local = () => {
    const local_strategy = require('passport-local').Strategy
    const passport = require('passport')
    const { client } = require('./mongo_connection')
    const bcrypt = require('bcrypt')

    const users = client.db(process.env.DB_NAME).collection('users')

    passport.serializeUser((user, done) => done(null, user._id))
    passport.deserializeUser((id, done) => {
        users.findOne({ "_id": id },
            (err, result) => done(err, result))
    })

    const authenticator = (email, password, done) => {
        users.findOne({
            "email": email
        },
            async (err, result) => {
                if (err) return done(err)
                else if (!result) return done(null, false, { message: "No user exist" })
                else if (await bcrypt.compare(password, result.password) === false) return done(null, false, { message: "Password does nto match" })
                else return done(null, result)
            })
    }

    passport.use(new local_strategy({ usernameField: 'email' }, authenticator))

}