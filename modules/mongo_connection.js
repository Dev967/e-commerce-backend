const mongo = require('mongodb')

const connection_options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

const client = new mongo.MongoClient(process.env.URI, connection_options)

const init = (server) => {
    client.connect()
        .then(res => {
            console.log('MongoDB connection successful')
            server.listen(process.env.PORT,
                () => console.log(`server is running on PORT ${process.env.PORT}`))
        })
        .catch(err => {
            console.log(`MongoDB connection failed ${err}`)
            res.send(`MongoDB connection failed ${err}`)
        })
}

module.exports = {
    init,
    client
} 