const deleteImages = require('./imageDeleter')

//prepare object
//rest fields will be set later
let productTemplate = {
    name: "",
    category: "",
    price: "",
    color: "",
    rating: "",
    description: "",
}

//change this if number of fields are changed
const numberOfFields = 6

//to check if a product already exists
const exists = (userProducts, productName) => {
    let returnValue = false
    userProducts.forEach((product) => {
        if (product.name == productName) {
            returnValue = true
        }
    })
    return returnValue
}

//@MIDDLEWARE
//@desc to validate incoming properties of product
//just a small check, main validation would be done on front-end
//@WARNING incoming data should be of same order as 'product'
const validator = (req, res, next) => {
    let product = { ...productTemplate }
    let incomingKeys = Object.keys(req.body)
    let incomingValues = Object.values(req.body)
    let shuoldBeKeys = Object.keys(product)

    //comparison
    //checking if same product already exist by same seller
    if (!exists(req.user.products, req.body.name)) {

        if (shuoldBeKeys.every((value, index) => value == incomingKeys[index])) {

            //prepare object to upload
            for (let i = 0; i < numberOfFields; i++) {
                product[`${incomingKeys[i]}`] = incomingValues[i]
            }

            //rest fields
            product["reviews"] = []
            product["seller"] = req.user.brandName

            //!!!INCOMPLETE
            //!!!populate this
            product["images"] = req.files.map(image => `${process.env.baseURL}/images/download/${image.id.toString()}`)

            //finally populate 'req' with freshly creted product object
            //so that it can be included in db
            req.product = {
                success: true,
                data: product,
                error: null
            }

            product = {}
            next()
            //next trigers product upload

        } else {
            deleteImages(req, res, {
                success: false,
                message: "product already exist",
                data: null
            })
            //!!!HANDLE ERRORS HERE
            // else 
            //images deletion failed
        }
    } else {
        //if fields not matched
        deleteImages(req, res, {
            success: false,
            message: "fields do not match, try cheking order of fields",
            data: null
        })
        //!!!HANDLE ERRORS HERE
    }
}

module.exports = validator