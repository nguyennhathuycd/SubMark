const express = require('express');
const router = express.Router();
const Class = require('../models/class')
var nodemailer = require("nodemailer");
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://nguyennhathuycd:*N123456789@cluster0.wvlgp.mongodb.net/supmark?retryWrites=true&w=majority";

const {mutipleMongooseToObject} = require('../util/mongoose')
const {mongooseToObject} = require('../util/mongoose')
  

// Classroom page
router.get('/', function(req, res, next) {
  let sendUser
  let classIDs = [];
   MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("supmark");
    var userID = ObjectId(req.session._id);
    if (req.session.role === "Student") {
      dbo.collection("students").findOne({userID: userID}, (err, student) => {
        if (err) throw err;
        if (student) {
          for(var i = 0; i < student.classIDs.length; i++) {
            classIDs[i] = student.classIDs[i].id;
          }
        }
        Class.find({_id: {$in: classIDs}})
        .then(classes => {
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
          db.close()
          res.render('studentClassroom', { 
            classes: mutipleMongooseToObject(classes), style:'ClassroomManagement.css', user: sendUser
            })
        })
        .catch(next)
      })
    } else if (req.session.role === "Teacher") {
      dbo.collection("teacher").findOne({userID: userID}, (err, teacher) => {
        if (err) throw err;
        if (teacher) {
          for(var i = 0; i < teacher.classIDs.length; i++) {
            classIDs[i] = teacher.classIDs[i].id;
          }
        }
        Class.find({_id: {$in: classIDs}})
        .then(classes => {
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
          db.close()
          res.render('classroom', { 
            classes: mutipleMongooseToObject(classes), style:'ClassroomManagement.css', user: sendUser
            })
        })
        .catch(next)
      })
    }
  })
});

// Function random class code
function makeClassCode(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Function random class code
function makeClassID(length) {
  var result           = '';
  var characters       = '0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// Create a new class
router.post('/', function(req, res, next) {
  if (req.session.role === "Student") {
    console.log(req.session._id)
    var ObjectId = require('mongodb').ObjectId;
    var userID = ObjectId(req.session._id);
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("supmark");
      var class_ID ;
      dbo.collection("classes").findOne({class_ID: req.body.class_ID, class_code: req.body.class_code}, (err, classes) => {
        if (err) throw err;
        class_ID = classes._id;
        if (classes) {
          dbo.collection("students").updateOne({userID: userID}, {$push: {classIDs : {"id": class_ID}},})
        }
      })
    })
  } else if (req.session.role === "Teacher"){
    var classData = {
      class_name: req.body.class_name,
      class_topic: req.body.class_topic,
    }
    var classID ;
    Class.create(classData, function (error, classes) {
      if (error) {
        res.json('Class is not created!')
      } else {
        class_ID = classes._id;
        classes.class_ID = makeClassID(11);
        classes.class_code = makeClassCode(8);
        classes.save();
      }
    });
  
    var ObjectId = require('mongodb').ObjectId;
    var userID = ObjectId(req.session._id);
  
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("supmark");
      
      dbo.collection("teacher").updateOne({userID: userID}, {$push: {classIDs : {"id": class_ID}},})
    })
  }
  return res.redirect('back')
});

// Open edit classroom page
router.get('/edit/:id', function(req, res, next) {
  let sendUser
  Class.findById(req.params.id)
  .then(classes => {
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
    res.render('editClassroom', { 
      classes: mongooseToObject(classes), style:'ClassroomEdit.css', user: sendUser
     })
  })
  .catch(next);
});

// Update a class
router.put('/edit/:id', function(req, res, next) {
  Class.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect('back'))
      .catch(next);
});

// Delete a class
router.delete('/edit/:id', function(req, res, next) {
  Class.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('/classroom'))
      .catch(next);
});


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'supmark.project@gmail.com',
    pass: '*N123456789',
  }
});

router.post('/invite/:id', function(req, res, next) {
  var stringEmail = req.body.email;
  var arrayEmail = stringEmail.split('\n');

  Class.findById(req.params.id)
    .exec(function (error, classes) {
      if (error) {
        return next(error);
      } else {
          var mailOptions = {
              from: "supmark.project@gmail.com", // sender address
              subject: "Invitation letter to the " + classes.class_name +" class", // Subject line
              text:
              `Dear Mr/Mrs,\n\nClass ID: ${classes.class_ID}\nClass code: ${classes.class_code}\n\nThank you,\nThe SupMark Team`,
              to: arrayEmail
          }

          transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                console.log(error)
                  res.redirect('back')
              } else {
                console.log(info)
                res.redirect('back')  
              }
          })
      }
  })
});

module.exports = router