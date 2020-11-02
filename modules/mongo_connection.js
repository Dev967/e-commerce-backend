require('dotenv').config()

const mongo = require('mongodb')

const connection_options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
const client = new mongo.MongoClient(process.env.URI, connection_options).connect()

const init = async (server) => {
    try {
        await client.connect()
        server.listen(process.env.PORT,
            () => console.log(`server is running on PORT ${process.env.PORT}`))
        db = client.db("crazy_shopper")

    } catch (err) {
        console.log(`Mongo connection failed ${err}`)
        res.send(`MongoDB connection failed ${err}`)
    }
    // client.connect()
    //     .then(res => {
    //         console.log('Mongo connection successful')
    //         main_db = client.db(process.env.DB_NAME)
    //         server.listen(process.env.PORT,
    //             () => console.log(`server is running on PORT ${process.env.PORT}`))
    //     })
    //     .catch(err => {
    //         console.log(`Mongo connection failed ${err}`)
    //         res.send(`MongoDB connection failed ${err}`)
    //     })
}
module.exports = {
    init,
    client
}
