const express = require('express');
const router = express.Router();
const Class = require('../models/class')

const {mutipleMongooseToObject} = require('../util/mongoose')
const {mongooseToObject} = require('../util/mongoose')


// Classroom page
router.get('/', function(req, res, next) {
    Class.find({})
    .then(classes => {
      res.render('classroom', { 
        classes: mutipleMongooseToObject(classes), style:'ClassroomManagement.css'
       })
    })
    .catch(next)
});

// Create a new class
router.post('/', function(req, res, next) {
  var classData = {
    class_name: req.body.class_name
  }
  Class.create(classData, function (error, classes) {
    if (error) {
      res.json('Class is not created!')
    } else {
      return res.redirect('back')
    }
  });
});

// Open edit classroom page
router.get('/edit/:id', function(req, res, next) {
  Class.findById(req.params.id)
  .then(classes => res.render('editClassroom', {
    classes: mongooseToObject(classes), style: 'ClassroomManagement.css'
  }))
  .catch(next);
});

// Update a class
router.put('/:id', function(req, res, next) {
  Class.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect('/classroom'))
      .catch(next);
});

// Delete a class
router.delete('/:id', function(req, res, next) {
  Class.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('back'))
      .catch(next);
});

  
module.exports = router