const Router = require('express').Router()
const { GridFSBucket } = require('mongodb')
const { client } = require('../modules/mongo_connection')
const { systemReserved } = require('../modules/authHandler')
const { ObjectId } = require('mongodb')
//user collection
// const users = main_db.collection('users')

//stream
let gfs = new GridFSBucket(client.db(process.env.DB_NAME), { bucketName: 'images' })


//@route GET /images/download/:id
//@desc route to get images rendered to browser
//@suggestion maybe try 'form-data' to pipe image to response
Router.route('/download/:id').get((req, res) => {
    gfs.find({ "_id": ObjectId(req.params.id) }).toArray()
        .then(result => {
            if (!result) return res.status(404).json({ success: false, message: "no files found !" })
            return gfs.openDownloadStream(ObjectId(req.params.id))
                .pipe(res)
                .once('err', (err) => {
                    return res.status(500).json({ success: false, message: err })
                });
        })
        .catch(err => res.json({ success: false, message: err }));
})

//Protected Routes

// @route POST /images/delete/
//@PROTECTED
// @desc route to delete file
Router.route('/delete/').post(systemReserved, (req, res) => {
    console.log(`\n delete request --> ${req.body.data.subject} \n by user --> ${req.body.data.user}`);
    gfs.find({ "_id": ObjectId(req.body.data.subject) }).toArray()
        .then(result => {
            if (!result) return res.status(404).json({ success: false, message: "files not found", data: req.body.data.subject })
            result.forEach(e => gfs.delete(e._id), (err) => res.status(400).json({ success: false, message: err, data: req.body.data.subject }));
            res.json({ success: true, message: "files deleted successfullly", data: null });
        })
        .catch(err => res.json({ success: false, message: err }));
});

// const imageDeleter = (files, userID) => {
//     console.log(`\n delete request --> ${files} \n by user --> ${userID}`);
//     let outcome = []
//     // files.forEach(image => {
//     //     outcome.push(gfs.find({ "_id": ObjectId(image.id) }).toArray()
//     //         .then(result => {
//     //             if (!result) return false
//     //             return result.map(e => gfs.delete(e._id));
//     //         })
//     //         .catch(err => false)
//     //     )
//     // })
//     outcome = files.map(image => {
//         gfs.find({ "_id": ObjectId(image.id) }).toArray()
//             .then(result => {
//                 if (!result) return false
//                 return result.map(e => gfs.delete(e._id));
//             })
//             .catch(err => false)
//     })
//     console.log(outcome)
//     return outcome
// }


//@Middleware addImages
//@PROTECTED
//@desc Middelware to upload images
// Router.route('/add').post(/*systemReserved,*/ upload.array("images"),(req, res) => {
//     res.json({ success: true, message: "files uploaded successfully", files: req.files })
// })


module.exports = {
    Router
};
