var express = require('express');
var router = express.Router();
const multer = require('multer');
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://nguyennhathuycd:*N123456789@cluster0.wvlgp.mongodb.net/supmark?retryWrites=true&w=majority";

// GET for logout logout
router.get('/', function (req, res, next) {
    var userID = req.session._id;

    let sendUser
    if (req.session._id) {
        sendUser = {
        name: req.session.name
        }
    } else {
        sendUser = {
        name: req.user.name.familyName + ' ' + req.user.name.givenName,
        picture: req.user.picture
        }
    }

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("supmark");
        var submit = dbo.collection("submissions").findOne({studentID: userID})
            .then( function(submit) {
                if (submit) {
                    res.render('submit', {assignments: true, img: submit.images ,title: req.query.t ,assignmentID: req.query.a ,class_name: req.query.class_name, classID : req.query.classID ,role: "Student", user: sendUser ,style: "submit.css"}) 
                } else {
                    res.render('submit', {assignments: true, img: "false" ,title: req.query.t ,assignmentID: req.query.a ,class_name: req.query.class_name, classID : req.query.classID ,role: "Student", user: sendUser ,style: "submit.css"}) 
                }
            })
    })
});

const storage = multer.diskStorage({
    //destination for files
    destination: function(request, file, callback) {
        callback(null, 'src/public/uploads/images');
    },

    //add back the extension
    filename: function(request, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});

//upload parameters for multer
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
});

router.post('/', upload.single('image'), (request, response) => {
    var submitIDs = [];
    var assignmentID = ObjectId(request.query.a);

    try {
        var studentID = request.session._id;
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("supmark");
            dbo.collection("submissions").findOneAndUpdate({studentID: studentID}, {$set: {images: request.file.filename, studentID: request.session._id, timeSubmission: Date.now()}}, {upsert: true})
                .then( function(submission) {
                    console.log("submitssion:")
                    console.log(submission)
                    var submissionID;
                    if (submission.value) {
                        submissionID = submission.value._id;
                    } else {
                        submissionID = submission.lastErrorObject.upserted;''
                    }
                    console.log("submissionID: " + submissionID)
                    dbo.collection("mark").updateOne({studentId: studentID},{$set: {studentId:studentID, submissionId: submissionID,img: request.file.filename, nameST: request.session.name, question: []}}, {upsert: true})
                    var assignment = dbo.collection("assignments").findOne({_id: assignmentID})
                        .then (function (assignment) {
                            if (assignment) {
                                for(var i = 0; i < assignment.submitted.length; i++) {
                                    submitIDs[i] = assignment.submitted[i].id;
                                }
                                var checkHasSubmit = false;
                                for (var j = 0; j < submitIDs.length; j++) {
                                    if (submitIDs[j].toString() == submissionID.toString()) {
                                        checkHasSubmit = true;
                                        break;
                                    }
                                }
                                console.log("checkHasSubmit" + checkHasSubmit)
                                if (checkHasSubmit !== true) {
                                    dbo.collection("assignments").updateOne({_id: assignmentID}, {$push: {submitted : {"id": submissionID}},})
                                }
                            }
                        })
                })
            })
            response.redirect('back');
    } catch (error) {
        console.log(error);
    }
});

module.exports = router