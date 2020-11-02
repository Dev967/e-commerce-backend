const client = require("./mongo_connection").client

let users
// const users = client.db(process.env.DB_NAME).collection('users')
client.then(result => users = result.db(process.env.DB_NAME).collection('users'))
    .catch(er => console.log(er))

//Middelware to check if user already exist
module.exports = (req, res, next) => {
    users.findOne({ "email": req.body.email },
        (err, result) => {
            if (err) {
                //conneciton problem
                console.log("error occured", err)
                return res.status(400)
                    .json(
                        {
                            success: false,
                            message: err
                        })
            }
            else if (result) {
                //if user exist
                return res.status(400)
                    .json(
                        {
                            success: false,
                            message: "user already exist"
                        })
            }
            else next()
        })
}