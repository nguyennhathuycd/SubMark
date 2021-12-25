var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/',function(req, res) {
  res.render('sign_in', {style: 'main.css', notLoggin: true})
})

router.post('/', function (req, res){
  let errors;
  if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        errors = 'Wrong email or password';
        res.render('sign_in', {errors:errors, style: 'main.css', notLoggin: true})
      } else {
        req.session._id = user._id;
        req.session.name = user.name;
        req.session.role = user.role;
        if (req.session.role == "Student") {
          res.redirect('classroom?r=student');
        } else {
          res.redirect('classroom?r=teacher');
        }
      }
    });
  } else {
    errors = 'Please enter email and password';
    res.render('sign_in', {errors:errors, style: 'main.css', notLoggin: true})
  }
  });

module.exports = router;