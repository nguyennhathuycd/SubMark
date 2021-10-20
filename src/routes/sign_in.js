var express = require('express');
var router = express.Router();
var User = require('../models/user');

const {mongooseToObject} = require('../util/mongoose')

router.get('/',function(req, res, next) {
  res.render('sign_in', {style: 'main.css'})
})

router.post('/', function (req, res, next){
  let errors;
  if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        errors = 'Wrong email or password';
        res.render('sign_in', {errors:errors, style: 'main.css'})
      } else {
        req.session.userId = user._id;
        return res.redirect('classroom');
      }
    });
  } else {
    errors = 'Please enter email and password';
    res.render('sign_in', {errors:errors, style: 'main.css'})
  }
  });

module.exports = router;