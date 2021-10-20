var express = require('express');
var router = express.Router();
var User = require('../models/user');
const { body, validationResult } = require('express-validator');

router.get('/', function(req, res, next) {
    res.render('sign_up', {style: 'main.css'})
})

//POST route for updating data
router.post('/', 
  [body('email').isEmail().withMessage('Invalid email address'),
  body('password')
  .isLength(8).withMessage('Password must have 8 characters')
  .matches('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$').withMessage('Password must contain at least one number and one letter.'),
  body('phone')
  .matches(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/).withMessage('Invalid phone number')
  ], async (req, res) =>{
  let errors = validationResult(req);
  if (await !errors.isEmpty()) {
    // return res.status(422).json({ errors: errors.array() });
    return res.render('sign_up', {errors: errors.array(), style: 'main.css'});
  }
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    errors = [{"location": "body"},{"msg": "Password dont match"}]
    return res.render('sign_up', {errors: errors, style: 'main.css'});
  }

  if (req.body.email &&
    req.body.role &&
    req.body.phone &&
    req.body.password &&
    req.body.passwordConf) {

    User.findOne({email:req.body.email})
    .exec(function (err, user) {
      if (user) {
        errors = [{"location": "body"},{"msg": "Email has already registered. Please use a different email!"}]
        return res.render('sign_up', {errors: errors, style: 'main.css'});
      } else{
        var userData = {
          email: req.body.email,
          phone: req.body.phone,
          role: req.body.role,
          password: req.body.password,
        }
    
        User.create(userData, function (error, user) {
          if (error) {
            errors = [{"location": "body"},{"msg": "User is not created!"}]
            return res.render('sign_up', {errors: errors, style: 'main.css'});
          } else {
            req.session.userId = user._id;
            return res.redirect('classroom');
          }
        });
      }
    });

  } else {
    errors = [{"location": "body"},{"msg": "All fields required"}]
    return res.render('sign_up', {errors: errors, style: 'main.css'});
  }
})

module.exports = router