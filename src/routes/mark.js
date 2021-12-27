const express = require('express');
const router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://nguyennhathuycd:*N123456789@cluster0.wvlgp.mongodb.net/supmark?retryWrites=true&w=majority";

router.get('/', function(req, res, next) {
  let perPage = 1;
  let page = req.query.page || 0;
  var countTests;
  var maxPage;
  var submittedIDs = [];
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("supmark");
    var assignmentID = ObjectId(req.query.a);
    dbo.collection("assignments").findOne({_id: assignmentID})
      .then(function (assignment) {
        console.log(assignment)
        for(var i = 0; i < assignment.submitted.length; i++) {
          submittedIDs[i] = assignment.submitted[i].id;
        }
        dbo.collection("mark").find({submissionId: {$in: submittedIDs}}).toArray((err, totalDocument) => {
          if (err) throw err;
          countTests = totalDocument.length / 2;
          maxPage = totalDocument.length / 2;
        })
        var skipPage = perPage * page;
        dbo.collection("mark").find({submissionId: {$in: submittedIDs}}).limit(perPage).skip(skipPage).toArray((err, tests) => {
          if (err) throw err;
          let sendUser
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
          return res.render('mark_test', {tests: tests, assignmentID: req.query.a, currentPage: page, pages: Math.ceil(countTests / perPage), maxPage: maxPage ,isMarkPage: true ,style: "mark_test.css", user: sendUser})
        });
      })
  });
});

router.post('/', function(req, res, next) {
  var criterions = req.body;
  var currentPage = Number(req.query.page);
  // let assignmentID = ObjectId(req.query.a)
  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err)
    };
    var dbo = db.db("supmark");
    if (currentPage == 0) {
      dbo.collection("mark").findOne({assignmentID: req.body.assignmentID})
        .then( function(firstDocument) {
          console.log(firstDocument.totalPoint)
          if (firstDocument.totalPoint == 0) {
            var question = criterions.question
            var totalPoint = criterions.totalPoint;
             dbo.collection("mark").updateOne({assignmentID: req.body.assignmentID}, {$set: {totalPoint, question}})
              .then( function() {
                var newCriterions = criterions;
                for (var i = 0; i < newCriterions.question[0].criteria.length; i++) {
                  newCriterions.question[0].criteria[i].checkbox = 0;
                }
                question = newCriterions.question;
                
                // Skip first document
                let foundData =  dbo.collection("mark").find({assignmentID: req.body.assignmentID}).skip(1);
                let IDs = [];
                foundData.forEach(element => {

                  IDs.push(element._id)
                })
                 dbo.collection("mark").updateMany({_id: { $in: IDs}},{$set: {question}})
              }) 
          } else {
            var question = criterions.question;
             dbo.collection("mark").updateOne({assignmentID: req.body.assignmentID}, {$set: {"totalPoint": req.body.totalPoint,question}})
          }
        })
    } else {
      var question = criterions.question;
      var id = ObjectId(req.body.test_id)
      console.log(id)
       dbo.collection("mark").updateOne({_id: id}, {$set: {question, totalPoint: req.body.totalPoint}})
    }
  })
})


module.exports = router