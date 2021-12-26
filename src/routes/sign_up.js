var express = require('express');
var router = express.Router();
var User = require('../models/user');
const { body, validationResult } = require('express-validator');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://nguyennhathuycd:*N123456789@cluster0.wvlgp.mongodb.net/supmark?retryWrites=true&w=majority";

router.get('/', function(req, res, next) {
    res.render('sign_up', {style: 'main.css', notLoggin: true})
})

//POST route for updating data
router.post('/', 
  [body('email').isEmail().withMessage('Invalid email address'),
  body('name'),
  body('password')
  .isLength(8).withMessage('Password must have 8 characters')
  .matches('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$').withMessage('Password must contain at least one number and one letter.'),
  body('phone')
  .matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/).withMessage('Invalid phone number')
  ], async (req, res) =>{
  let errors = validationResult(req);
  if (await !errors.isEmpty()) {
    // return res.status(422).json({ errors: errors.array() });
    console.log(errors)
    return res.render('sign_up', {errors: errors.array(), style: 'main.css', notLoggin: true});
  }
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    errors = [{"msg": "Password don not match"}]
    return res.render('sign_up', {errors: errors, style: 'main.css', notLoggin: true});
  }

  if (req.body.email &&
    req.body.role &&
    req.body.name &&
    req.body.phone &&
    req.body.password &&
    req.body.passwordConf) {

    User.findOne({email:req.body.email})
    .exec(function (err, user) {
      if (user) {
        errors = [{"msg": "Email has already registered. Please use a different email!"}]
        console.log(errors)
        return res.render('sign_up', {errors: errors, style: 'main.css', notLoggin: true});
      } else{
        var userData = {
          email: req.body.email,
          name: req.body.name,
          phone: req.body.phone,
          role: req.body.role,
          password: req.body.password,
        }
        
        User.create(userData, function (error, user) {
          if (error) {
            errors = [{"msg": "User is not created!"}]
            return res.render('sign_up', {errors: errors, style: 'main.css', notLoggin: true});
          } else {
            req.session._id = user._id;
            req.session.name = user.name;
            if (req.body.role == "Teacher") {
              req.session.role = "Teacher";
              var teacherData = {
                email: req.body.email,
                name: req.body.name,
                phone: req.body.phone,
                userID: user._id,
                classIDs: []
              }
              MongoClient.connect(url, async function(err, db) {
                if (err) throw err;
                var dbo = db.db("supmark");
                await dbo.collection("teacher").insertOne(teacherData)
                db.close();
              })
            } else if (req.body.role == "Student") {
              req.session.role = "Student";
              var studentData = {
                email: req.body.email,
                name: req.body.name,
                phone: req.body.phone,
                userID: user._id,
                classIDs: []
              }
              MongoClient.connect(url, async function(err, db) {
                if (err) throw err;
                var dbo = db.db("supmark");
                await dbo.collection("students").insertOne(studentData)
                db.close();
              })
            }
            return res.redirect('/classroom');
          }
        });
      }
    });
  } else {
    errors = [{"msg": "All fields required"}]
    res.redirect('/classroom');
  }
})

module.exports = router