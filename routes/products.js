const client = require('../index');
const Router = require('express').Router();

const products = client.db('crazy_shopper').collection('products');

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
    products.find({ "id": req.params._id }).toArray()
        .then(result => res.json(result))
        .catch(err => res.status(404).json("object not found"));
})

//@route GET /products/search?name=value
//@desc To search a prduct based on category or name
Router.route('/search').get((req, res) => {
    if (req.query.name) {
        prodcuts.find({ "name": req.query.name }).toArray()
            .then(result => res.json(result))
            .catch(err => res.status(404).json("object not found"));
    }
    else if (req.query.type) {
        res.json({ recieved: req.query.type });
    }
})

//@route GET /product/test
//@desc To test if router is working or not
Router.route('/test').get((req, res) => {
    console.log(req.query.testquery);
    res.send("Router Products is working fine !");
})
module.exports = Router;