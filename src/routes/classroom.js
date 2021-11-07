const express = require('express');
const router = express.Router();
const Class = require('../models/class')
var nodemailer = require("nodemailer");

const {mutipleMongooseToObject} = require('../util/mongoose')
const {mongooseToObject} = require('../util/mongoose')
  

// Classroom page
router.get('/', function(req, res, next) {
  let sendUser
    Class.find({})
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
      res.render('classroom', { 
        classes: mutipleMongooseToObject(classes), style:'ClassroomManagement.css', user: sendUser
       })
    })
    .catch(next)
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

// Create a new class
router.post('/', function(req, res, next) {
  var classData = {
    class_name: req.body.class_name,
    class_topic: req.body.class_topic,
  }
  Class.create(classData, function (error, classes) {
    if (error) {
      res.json('Class is not created!')
    } else {
      classes.class_code = makeClassCode(8);
      classes.save();
      return res.redirect('back')
    }
  });
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
    user: 'SupMark.project@gmail.com',
    pass: 'Zxcvbnm1@',
  }
});

router.post('/invite/:id', function(req, res, next) {
  var stringEmail = req.body.email;
  var arrayEmail = stringEmail.split(', ');

  Class.findById(req.params.id)
    .exec(function (error, classes) {
      if (error) {
        return next(error);
      } else {
          var mailOptions = {
              from: "SupMark.project@gmail.com", // sender address
              subject: "Invitation letter to the " + classes.class_name +" class", // Subject line
              text:
              `Dear Mr/Mrs,\n\nLink class: https://Supmark.herokuapp.com/classroom/${classes._id}\nClass code: ${classes.class_code}\n\nThank you,\nThe SupMark Team`,
              to: arrayEmail
          }

          transporter.sendMail(mailOptions, function(error, info) {
              if (error) {
                  res.redirect('back')
              } else {
                res.redirect('back')  
              }
          })
      }
  })
});

module.exports = router