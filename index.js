//first to do's
require('dotenv').config()
const { init } = require('./modules/mongo_connection')

//initialization of server and connecting to MongoDB
const express = require('express')
const server = express()
init(server)

//rest of require stack
const session = require('./modules/session')
const authenticator = require('./modules/authenticator').authenticator
//routes
const Images = require('./routes/images')
const Products = require('./routes/products')
const User = require('./routes/user')

//middlewares
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(session)
server.use(authenticator)

//Routes
server.use('/images', Images)
server.use('/products', Products)
server.use('/user', User)