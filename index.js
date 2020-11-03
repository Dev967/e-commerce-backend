//first to do's
// require('dotenv').config()
const { init } = require('./modules/mongo_connection')

//initialization of server and connecting to MongoDB
const express = require('express')
const server = express()
init(server)

//rest of require stack
const session = require('./modules/session')
const authenticator = require('./modules/authenticator').authenticator
const csrf = require('csurf')

//middlewares
server.use(csrf)
server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use(session)
server.use(authenticator)

//routes
const Images = require('./routes/images').Router
const Products = require('./routes/products')
const User = require('./routes/user')
//Routes
server.use('/images', Images)
server.use('/products', Products)
server.use('/user', User)