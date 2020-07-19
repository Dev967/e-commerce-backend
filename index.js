const mongo = require('mongodb');
const express = require('express');
const assert = require('assert');
const config = require('./config');

const PORT = config.port;
const URI = config.uri;

//Express Server
const server = express();


//Mongodb Connection establishment
const client = new mongo.MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect()
    .then(result => {
        server.listen(PORT, (err) => console.log(`Server is listening on PORT ${PORT}`))
    })
    .catch(err => console.log(err))

module.exports = client;

//Routes
const Images = require('./routes/images');
const Products = require('./routes/products');

server.use('/images', Images);
server.use('/products', Products);