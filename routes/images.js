const multer = require('multer')
const Router = require('express').Router()
const { checkSeller } = require('../modules/authHandler')
const { storage } = require('../modules/image_storage_engine')
const { GridFSBucket } = require('mongodb')
const { client } = require('../modules/mongo_connection')

//stream
let gfs = new GridFSBucket(client.db(process.env.DB_NAME), { bucketName: 'images' })

//multer
const upload = multer({ storage })

//@route GET /images/download/:name
//@desc route to get images rendered to browser
Router.route('/download/:name').get((req, res) => {
    gfs.find({ "filename": `${req.params.name}.jpg` }).toArray()
        .then(result => {
            if (!result) res.status(404).json({ success: false, message: "no files found !" })
            // else {
            gfs.openDownloadStreamByName(`${req.params.name}.jpg`).pipe(res)
                .once('err', (err) => {
                    return res.status(400).json({ success: false, message: err })
                });
            // }
        })
        .catch(err => res.json({ success: false, message: err }));
})

//Protected Routes

//@PROTECTED
//@route POST /images/add
//@desc route to upload images
Router.route('/add').post(checkSeller, upload.array("images", 4), (req, res) => {
    res.json({ success: true, message: "files uploaded successfully" })
})

//@PROTECTED
// @route POST /images/delete/:filename
// @desc route to delete file
Router.route('/delete/:filename').delete(checkSeller, (req, res) => {
    console.log(`\n delete request --> ${req.params.filename}`);
    gfs.find({ "filename": `${req.params.filename}.jpg` }).toArray()
        .then(result => {
            result.forEach(e => gfs.delete(e._id), (err) => res.status(400).json({ success: false, message: err }));
            res.json({ success: true, message: "files deleted successfullly" });
        })
        .catch(err => res.json({ success: false, message: err }));
});

//TODO
//update routes
module.exports = Router;