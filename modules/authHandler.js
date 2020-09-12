const isEmpty = require('./isEmpty')

//@FUNCTION checkAuth
//@DESC proceed if user is authintacated else redirect to failure
const checkAuth = (req, res, next) => {
    if (!isEmpty(req.user)) next()
    else {
        res.redirect(process.env.failureRedirect)
    }
}

//@FUNCTION checkNotAuth
//@DESC proceed if user is not authenticated else redirect to success
const checkNotAuth = (req, res, next) => {
    if (isEmpty(req.user)) next()
    else res.redirect(process.env.successRedirect)
}

//@FUNCTION checkSeller
//@DESC proceed if user is seller or admin else send failure message
const checkSeller = (req, res, next) => {
    if (req.user.type == "admin" || req.user.type == "seller") next()
    else res.status(401).json({ success: false, message: "permisson denied" })
}

//FUNCTION checkAdmin
//@DESC proceed if user is admin else send failure message
const checkAdmin = (req, res, next) => {
    if (req.user.type == "admin" || req.user.type == "seller") next()
    else res.status(401).json({ success: false, message: "permisson denied" })
}

module.exports = {
    checkAuth,
    checkNotAuth,
    checkSeller,
    checkAdmin
}