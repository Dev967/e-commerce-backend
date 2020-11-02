const { client } = require('../modules/mongo_connection')
const products = client.db(process.env.DB_NAME).collection('products')
const { ObjectId } = require('mongodb')


const middleware = (req, res, next) => {
    let exist = false
    let response = {
        success: false,
        message: "invalid input",
        data: null
    }

    req.user.products.forEach(element => {
        if (element.id == req.params.id) return exist = true
    })

    //if exist
    if (exist) {
        //find product
        products.findOne({ "_id": ObjectId(req.params.id) })
            .then(result => {
                if (result) {
                    //extract imagesID
                    req.files = result.images.map(image => { return obj = { id: image.split('/')[5] } })
                    next()
                }
                else {
                    response['message'] = "object not found"
                    res.send(response)
                }
            })
            .catch(err => {
                response["message"] = err
                res.send(response)
            })
    }

}

module.exports = middleware