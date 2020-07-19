const Router = require('express').Router();
const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
const mongo = require('mongodb');
const multer = require('multer');
const URI = require('../config').uri;
const client = require('../index');

//stream
let gfs = new mongo.GridFSBucket(client.db('crazy_shopper'), { bucketName: 'images' });

//storage engine
const storage = GridFsStorage({
    url: URI + "/crazy_shopper",
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
                };
                resolve(fileInfo);
            });
        });
    }
});

//multer
const upload = multer({ storage });

//CRUD

//@route POST /images/add
//@desc route to upload images
Router.route('/add').post(upload.array("images", 4), (req, res) => {
    res.json({ success: true, message: "files uploaded successfully" });
})

//@route GET /images/download/:name
//@desc route to get images rendered to browser
Router.route('/download/:name').get((req, res) => {
    gfs.find({ "filename": `${req.params.name}.jpg` }).toArray()
        .then(result => {
            if (!result) res.status(404).json({ success: false, message: "no files found !" });
            // else {
            gfs.openDownloadStreamByName(`${req.params.name}.jpg`).pipe(res)
                .once('err', (err) => {
                    return res.status(400).json({ success: false, message: err });
                });
            // }
        })
        .catch(err => res.json({ success: false, message: err }));
})



// @route POST /images/delete/:filename
// @desc route to delete file
Router.route('/delete/:filename').post((req, res) => {
    console.log(`\n delete request --> ${req.params.filename}`);
    gfs.find({ "filename": `${req.params.filename}.jpg` }).toArray()
        .then(result => {
            result.forEach(e => gfs.delete(e._id), (err) => res.status(400).json({ success: false, message: err }));
            res.json({ success: true, message: "files deleted successfullly" });
        })
        .catch(err => res.json({ success: false, message: err }));
});


//@route GET /images/test
//@desc route for testing purpose
Router.route('/test').get((req, res) => res.send("Router Images working fine !!"))
module.exports = Router;