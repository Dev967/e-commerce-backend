const crypto = require('crypto')
const path = require('path')
const GridFsStorage = require('multer-gridfs-storage')

//storage engine
const storage = GridFsStorage({
    url: process.env.URI + "/crazy_shopper",
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'images'
                }
                resolve(fileInfo);
            })
        })
    }
})


module.exports = storage