var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://nguyennhathuycd:*N123456789@cluster0.wvlgp.mongodb.net/supmark?retryWrites=true&w=majority";
var ObjectId = require('mongodb').ObjectId;


// GET route after registering
router.get('/', function (req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err)
    };
    var dbo = db.db("supmark");
    let condition
    if (req.session._id) {
      condition = { _id : new ObjectId(req.session._id)}
    } else if (req.user) {
      condition = {googleId: req.user.id}
    }
    console.log("req.session._id " + req.session._id)
    console.log("condition: " + condition)
    dbo.collection("users").findOne(condition, function(err, user) {
      if (err) {
        console.log(err)
      } else {
        console.log(user)
        db.close()
        if (req.session._id) {
          res.render('profile', {user: user, style:'ClassroomManagement.css'})
        } else {
          res.render('profile', {user: user, style:'ClassroomManagement.css'})
        } 
      }
    })
  })
});

module.exports = router