const express = require('express');
const router = express.Router();
const passport = require('passport');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://nguyennhathuycd:*N123456789@cluster0.wvlgp.mongodb.net/supmark?retryWrites=true&w=majority";

router.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/callback', passport.authenticate('google', { failureRedirect: '/authGoogle/fail' }),
    function(req, res) {
      // Successful authentication, redirect url /authGoogle/good.
      res.redirect('/authGoogle/good');
    }
);

router.get('/fail', function(req, res) {
      res.render('sign_in', {style: 'main.css', errors: 'Fail to sign in by Google account.', notLoggin: true});
    }
);

router.get('/good',  function (req, res) { 
   MongoClient.connect(url, async function(err, db) {
        if (err) {
          console.log(err)
        };
        var dbo = db.db("supmark");
        await dbo.collection("users").findOne({googleId: req.user.id}, function(err, result) {
          if (result) {
            req.session._id = result._id;
            db.close();
          } else {
            var myobj = { email: req.user.emails[0].value ,name: req.user.name.familyName + ' ' + req.user.name.givenName, picture: req.user.picture, googleId: req.user.id};
            dbo.collection("users").insertOne(myobj, function(err, res, next) {
              if (err) {
                console.log(err)
              }
              db.close();
            });
            dbo.collection("users").findOne({googleId: req.user.id}, function(err, result) {
              if (err) {
                console.log(err)
              }
              db.close();
            })
          }
        })
      }); 
      res.redirect('/classroom')
  })

module.exports = router