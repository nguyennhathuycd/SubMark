var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/',function(req, res, next) {
  res.render('sign_in')
})

router.post('/', function (req, res, next){
  let errors;
  if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        errors = 'Wrong email or password';
        return res.render('sign_in', {errors:errors})
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    errors = 'Please enter email and password';
    return res.render('sign_in', {errors:errors})
  }
  });

module.exports = router;