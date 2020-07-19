// const URI = "mongodb+srv://Dev:Devraj@967@first-cluster-9llkc.mongodb.net/crazy_shopper?retryWrites=true&w=majority";
const URI = "mongodb://localhost:27017";
const PORT = process.env.PORT || 5000;

module.exports = {
    uri: URI,
    port: PORT
}