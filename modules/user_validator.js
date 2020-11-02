const bcrypt = require('bcrypt')

//user profile template
const userTemplate = {
    email: "",
    username: "",
    password: "",
    gender: "",
    address: "",
    user_type: "",
}

const encryptPass = async (pass) => {
    return await bcrypt.hash(pass, 5)
}

//to validate fields
const validator = (req, res, next) => {
    let fieldsDontMatch = false
    let newUser = { ...userTemplate }
    let incomingValues = Object.values(req.body)
    let incomingKeys = Object.keys(req.body)

    //since date is system generated

    //if incoming request is for a seller account
    if (req.body.user_type == "seller") {

        //BrandName
        newUser['brandName'] = ""


        let shuoldBeKeys = Object.keys(newUser)
        newUser['date'] = Date.now()
        newUser['products'] = []

        if (shuoldBeKeys.length == incomingKeys.length) {
            if (shuoldBeKeys.every((value, index) => value == incomingKeys[index])) {

                //populate user object
                for (let i = 0; i < shuoldBeKeys.length; i++) {
                    newUser[[`${incomingKeys[i]}`]] = incomingValues[i]
                }

                //enrypt password and add to 'newUser'
                //it is important that this is done here
                newUser['password'] = encryptPass(req.body.password)

                req.newUser = newUser
                newUser = {}
                next()

            }
        } else fieldsDontMatch = true

    }
    else if (req.body.user_type == "customer") {
        let shuoldBeKeys = Object.keys(newUser)
        newUser['date'] = Date.now()

        if (incomingKeys.length == shuoldBeKeys.length) {
            if (shuoldBeKeys.every((value, index) => value == incomingKeys[index])) {
                //populate user object
                for (let i = 0; i < shuoldBeKeys.length; i++) {
                    newUser[`${incomingKeys[i]}`] = incomingValues[i]
                }

                //enrypt password and add to 'newUser'
                //it is important that this is done here
                newUser['password'] = encryptPass(req.body.password)

                req.newUser = newUser
                newUser = {}
                next()
            }
        } else fieldsDontMatch = true
    }
    else {
        //if request is for admin accont reject it
        return res.status(400).json(
            {
                success: false,
                message: "unknown user cant be added",
                data: null
            })
    }
    if (fieldsDontMatch) {
        return res.status(400).json({
            success: false,
            message: "fields do not match",
            data: null
        })
    }
}

module.exports = validator