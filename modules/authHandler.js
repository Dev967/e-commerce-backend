const isEmpty = require('./isEmpty')

//@MIDDLEWARE checkAuth
//@DESC proceed if user is authintacated else redirect to failure
const checkAuth = (req, res, next) => {
    if (!isEmpty(req.user)) next()
    else {
        res.redirect(process.env.failureRedirect)
    }
}

//@MIDDLEWARE checkNotAuth
//@DESC proceed if user is not authenticated else redirect to success
const checkNotAuth = (req, res, next) => {
    if (isEmpty(req.user)) next()
    else res.redirect(process.env.successRedirect)
}

//Route protection middlewares
const pemissionDenied = {
    success: false,
    message: "permisson denied",
    data: null
}

//@MIDDLEWARE checkSeller
//@DESC proceed if user is seller or admin else send failure message
const checkSeller = (req, res, next) => {
    if (req.user !== undefined && (req.user.user_type == "admin" || req.user.user_type == "seller")) next()
    else res.status(401).json(pemissionDenied)
}

//@MIDDLEWARE checkAdmin
//@DESC proceed if user is admin else send failure message
const checkAdmin = (req, res, next) => {
    if (req.user.user_type == "admin" || req.user.user_type == "seller") next()
    else res.status(401).json(pemissionDenied)
}

//@MIDDLEWARE systemReserved
//@DESC allows onlf those request that are generated from within application
const systemReserved = (req, res, next) => {
    if (req.body.systemKey == process.env._system_secret) next()
    else res.status(401).json(pemissionDenied)
}

module.exports = {
    checkAuth,
    checkNotAuth,
    checkSeller,
    checkAdmin,
    systemReserved
}