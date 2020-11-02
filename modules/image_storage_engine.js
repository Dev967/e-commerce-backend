const crypto = require('crypto')
const path = require('path')
const GridFsStorage = require('multer-gridfs-storage')
const multer = require('multer')
const { client } = require('../modules/mongo_connection')

const db = client.db(process.env.DB_NAME)

//make sure only 'jpeg' images are uploaded
const storage = GridFsStorage({
    db: db,
    file: (req, file) => new Promise((resolve, reject) => {
        if (path.extname(file.originalname) == '.jpg' ||
            path.extname(file.originalname) == '.jpeg' ||
            path.extname(file.originalname) == '.png') {

            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname)
                const fileInfo = {
                    filename: filename,
                    bucketName: 'images'
                }
                resolve(fileInfo)
            })
        } else return reject("Files not supported")
    })
})

const upload = multer({ storage })

module.exports = upload
