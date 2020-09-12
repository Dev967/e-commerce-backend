const session = require('express-session')
const mongo_store = require('connect-mongo')(session);
const mongo_client = require('./mongo_connection').client;

const mongo_store_options = {
    client: mongo_client,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
    ttl: 7 * 24 * 60 * 60
}
const cookieAge = 1000 * 60 * 60 * 24 * 7;

module.exports = session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: new mongo_store(mongo_store_options),
    cookie: {
        maxAge: cookieAge
    }
})