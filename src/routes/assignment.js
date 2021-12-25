const express = require('express');
const assignment = require('../models/assignment');
const router = express.Router();
const multer = require('multer');
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://nguyennhathuycd:*N123456789@cluster0.wvlgp.mongodb.net/supmark?retryWrites=true&w=majority";


//define storage for the images
//route for the index
router.get('/',  (req, res) => {
  var assignmentIDs = [];
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("supmark");
      var classID = ObjectId(req.query.classID);
      dbo.collection("classes").findOne({_id: classID}, async (err, classes) => {
        if (err) throw err;
        if (classes.assignmentIDs) {
          for(var i = 0; i < classes.assignmentIDs.length; i++) {
            assignmentIDs[i] = classes.assignmentIDs[i].id;
          }
        }
        let assignments = await assignment.find({_id: {$in: assignmentIDs}}).sort({ timeCreated: 'desc' }).lean();
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
        if (req.session.role === "Student") {
          res.render('studentAssignment', { assignments: assignments, classID: req.query.classID, class_name: req.query.class_name, role: "Student",style: "ListAssignment.css", user: sendUser });
        } else if (req.session.role === "Teacher") {
          res.render('ListAssignment', { assignments: assignments, classID: req.query.classID, class_name: req.query.class_name, role: "Teacher",style: "ListAssignment.css", user: sendUser });
        }
      })
    })
});

const storage = multer.diskStorage({
    //destination for files
    destination: function(request, file, callback) {
        callback(null, './src/public/uploads/images');
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

router.get('/create', (request, response) => {
    response.render('CreateAssignment', {classID: request.query.c,style: "CreateAssignment.css"});
});

//route that handles new post
router.post('/', upload.single('image'), async(request, response) => {
    var filename;
    if (request.file) {
      filename = request.file.filename;
    } else {
      filename = "";
    }
    let assignments = new assignment({
        title: request.body.title,
        description: request.body.description,
        img: filename,
        open_datetime: request.body.open_date + ", " + request.body.open_time,
        due_datetime: request.body.due_date + ", " + request.body.due_time,
        teacherName: request.session.name,
    });

    try {
        assignments = await assignments.save();
        var classID = ObjectId(request.query.c);
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("supmark");
          
          dbo.collection("classes").updateOne({_id: classID}, {$push: {assignmentIDs : {"id": assignments._id}},})
        })
        response.redirect('assignment?classID='+request.query.c);
    } catch (error) {
        console.log(error);
    }
});

module.exports = router