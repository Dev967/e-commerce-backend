const { client } = require('../modules/mongo_connection')
const Router = require('express').Router()
const isEmpty = require('../modules/isEmpty')
const checkSeller = require('../modules/authHandler').checkSeller
const { ObjectId } = require('mongodb')
const upload = require('../modules/image_storage_engine')
const validator = require('../modules/product_validator')

// .create(
//     {
//         baseURL: "http://localhost:5000"
//     }
// )
// axios.headers.post["Content-Type"] = "application/form-data";
const products = client.db(process.env.DB_NAME).collection('products')
const users = client.db(process.env.DB_NAME).collection('users')

//@route GET /products
//@desc To get all products as default page of site
Router.route('/').get((req, res) => {
    products.find().toArray()
        .then(result => res.json(result))
        .catch(err => res.status(400).json({
            success: false,
            message: err
        }))
})

//@route GET /products/:_id
//@desc To get one product
Router.route('/findbyid/:id').get((req, res) => {
    products.findOne({ "_id": ObjectId(req.params.id) })
        .then(result => {
            if (!result) res.json({
                success: false,
                data: null,
                message: "object not found"
            })
            else res.json({
                success: true,
                data: result,
                message: null
            })
        })
        .catch(err => res.status(404).json({ success: false, data: null, message: err }))
})

//@route GET /products/search?criteiria=value
//@EXAMPLE /products/search?name=Example
//@desc To search a prduct based on any criteria
Router.route('/search').get((req, res) => {
    if (!isEmpty(req.query)) {
        //if req.query is not empty
        products.findOne(req.query)
            .then(result => {
                if (result) res.json(result)
                else res.json({
                    success: false,
                    message: "object not found"
                })
            })
            .catch(err => {
                return res.status(404)
                    .json({
                        success: false,
                        message: err
                    })
            })
    } else res.json({
        ssuccess: false,
        message: "invalid input"
    })
})

//Protected Routes

//@route POST /products/delete
//@PROTECTED
//@desc To delete products
const imageDeleter = require('../modules/imageDeleter')
const deleteManager = require('../modules/product_delete_manager')
Router.route('/delete/:id').post(checkSeller, deleteManager, (req, res) => {
    //if here then images are already deleted successfully

    //now delete product
    products.deleteOne({ "_id": ObjectId(req.params.id) }, (err, result) => {
        if (err) return res.status(400)
            .json({
                success: false,
                message: err,
                data: null
            })
        else {
            //deleted succussfully
            //update user
            users.updateOne({ "_id": ObjectId(req.user.id) }, { $pop: { "products.id": ObjectId(req.params.id) } })
            imageDeleter(req, res, {
                success: true,
                message: "product deleted succesfully",
                data: null
            })
            //delete images


            return res.json(result)
        }
    })
})

//@route POST /products/add
//@PROTECTED
//@desc To add products
//@Note use "form-data"!!!! not 'x-www-form-urlencoded'

/*** 
THE CODE BELOW
first upload images and then validates incoming fields
if got some extra time do that so it first validates and then uploads images
***/

//step 1: check if user is authorized and all fields are present
//step 2: upload images
//step 2: check if a product already exists with that name, if does then delete uploaded images
//step 3: if it does not already exist populate req.product(coming from 'validator' middleware) with uploaded images url
//step 4: add uploaded product ID to user's(seller's) account
Router.route('/add').post(checkSeller, upload.array("images", 4), validator, (req, res, next) => {
    //if here than everything went right, no errors

    //add this product
    //code to insert product code goes here
    products.insertOne(req.product.data)
        .then(result => {
            //mark this product in sellers account
            users.updateOne({ "_id": req.user._id },
                {
                    $addToSet:
                    {
                        "products":
                            { "id": ObjectId(result.insertedId), "name": req.body.name }
                    }
                })
            //everything went right
            //END final message for success
            res.json({
                success: true,
                data: result.insertedId,
                error: null
            })
        })
        .catch(error => {
            //delete uploaded images
            //responle will be hadled there
            makeDeleteImagesRequest(error)
        })
})

//TODO
//delete routes
//update route
//route to show products a particular seller has put
module.exports = Router;
