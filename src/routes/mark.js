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
        for(var i = 0; i < assignment.submitted.length; i++) {
          submittedIDs[i] = assignment.submitted[i].id;
        }
        dbo.collection("mark").find({submissionId: {$in: submittedIDs}}).toArray((err, totalDocument) => {
          if (err) throw err;
          countTests = totalDocument.length;
          maxPage = totalDocument.length;
        })
        var skipPage = perPage * page;
        dbo.collection("mark").find({submissionId: {$in: submittedIDs}}).skip(skipPage).limit(perPage).toArray((err, tests) => {
          if (err) throw err;
          db.close();
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
          return res.render('test', {tests: tests, currentPage: page, pages: Math.ceil(countTests / perPage), maxPage: maxPage ,isMarkPage: true ,style: "test2.css", user: sendUser})
        });
      })
  });
});

router.post('/', function(req, res, next) {
  var criterions = req.body;
  var currentPage = Number(req.query.page);
  MongoClient.connect(url, async function(err, db) {
    if (err) {
      console.log(err)
    };
    var dbo = db.db("supmark");
    if (currentPage == 0) {
      let firstDocument = await dbo.collection("test_mark").findOne();
      
      console.log(firstDocument.question)
      if (!firstDocument.question) {
        var totalPoint = criterions.totalPoint;
        var question = criterions.question
        await dbo.collection("test_mark").updateOne({}, {$set: {totalPoint, question}})

        var newCriterions = criterions;
        for (var i = 0; i < newCriterions.question[0].criteria.length; i++) {
          newCriterions.question[0].criteria[i].checkbox = 0;
        }
        var question = newCriterions.question;
        console.log(question)
        console.log(question)
        
        // Skip first document
        let foundData = await dbo.collection("test_mark").find().skip(1);
        let IDs = [];
        foundData.forEach(element => {
          IDs.push(element._id)
        })
        await dbo.collection("test_mark").updateMany({_id: { $in: IDs}},{$set: {question}})
      } else {
        var question = criterions.question;
        await dbo.collection("test_mark").updateOne({}, {$set: {question}})
      }
    } else {
      var question = criterions.question;
      let foundData = await dbo.collection("test_mark").find().skip(currentPage).limit(1);
      let IDs = [];
      foundData.forEach(element => {
        IDs.push(element._id)
      })
      await dbo.collection("test_mark").updateOne({_id: { $in: IDs}}, {$set: {question, totalPoint: criterions.totalPoint},})
    }
    db.close();
  })
})


module.exports = router