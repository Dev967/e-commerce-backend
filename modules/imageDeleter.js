const axios = require('axios')
const client = require('./mongo_connection').client

const rogue = client.db(process.env.DB_NAME).collection('rogue')

//trash code 
//poor error handling :(
module.exports = makeDeleteImagesRequest = (req, res, message) => {
    let resp = {
        failed: false,
        message: ""
    }
    axios.all(
        req.files.map(image => {
            axios.post(`${process.env.baseURL}/images/delete`, {
                data: {
                    subject: image.id,
                    user: req.user._id
                    // user: userID
                }
            })
        })
    )
        .then(axios.spread((...responses) => {
            responses.forEach(response => {
                if (!response.success) {
                    rogue.updateOne({ "_id": ObjectId(process.env.rogueImageID) }, { $addToSet: { "images": response.data, reason: response.message } })
                    resp["failed"] = true,
                        resp["message"] = response.message
                }
            })
        }))
        .catch(errors => {
            if (errors) {
                resp["failed"] = true,
                    resp["message"] = err
            }
        })
        .then(final => {
            if (!resp.failed) resp.send(message)
            else res.send(resp)
        })
    //  {
    //make outcome an aray
    //store outcome of every request
    //if any contains folse
    //send  folse
    // let outcome = {
    //     success: false,
    //     message: "",
    //     data: null
    // }
    //     let deleteResults = files.map(image => {

    //         axios.post(`${process.env.baseURL}/images/delete`, {
    //             data: {
    //                 subject: image.id,
    //                 // user: req.user._id
    //                 user: userID
    //             }
    //         })
    //             .then(result => {
    //                 //deletion failed
    //                 if (!result.success) {
    //                     //do something if deletion is failed
    //                     //currently doing nothing
    //                     return outcome['message'] = result.message
    //                 }
    //                 else {
    //                     outcome['success'] = true
    //                     outcome['message'] = "image deleted"
    //                     return outcome
    //                 }
    //             })
    //             .catch(error => {
    //                 //deletion failed
    //                 //do something if error in sending request
    //                 //currently doing nothing
    //                 return outcome['message'] = error
    //             })
    //         //finally send response
    //     })
    //     // return outcome
    //     return deleteResults
}