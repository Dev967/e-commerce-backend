const { client } = require('../modules/mongo_connection')
const Router = require('express').Router()

const products = client.db(process.env.DB_NAME).collection('products');

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
Router.route('/:id').get((req, res) => {
    products.findOne({ "id": req.params._id })
        .then(result => res.json(result))
        .catch(err => res.status(404).json("object not found"));
})

//@route GET /products/search?name=value
//@desc To search a prduct based on category or name
Router.route('/search').get(async (req, res) => {
    if (req.query.name) {
        await prodcuts.findOne({ "name": req.query.name }, (err, result) => {
            if (err) {
                return res.status(404)
                    .json({
                        success: false,
                        message: "object not found"
                    })
            }
            res.json(result)
        })
    }
    else if (req.query.type) {
        res.json({ recieved: req.query.type });
        //async products.findOne()
    }
})

//TODO
//add and delete routes

module.exports = Router;