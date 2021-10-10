var express = require('express');
var router = express.Router();
var User = require('../models/user');

const {mongooseToObject} = require('../util/mongoose')

// GET route after registering
router.get('/', function (req, res, next) {
    User.findById(req.session.userId)
      .exec(function (error, user) {
        if (error) {
          return next(error);
        } else {
          if (user === null) {
            // var err = new Error('Not authorized! Go back!');
            // err.status = 400;
            // return next(err);
            // res.status(200).json('Your session has expired. Please log in again');
            let errors = 'Your session has expired. Please log in again';
            return res.render('sign_in', {errors:errors})
          } else {
            res.render('profile', {
              user: mongooseToObject(user)
            })
          }
        }
      });
  });

  module.exports = router