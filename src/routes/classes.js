const express = require('express');
const router = express.Router();
const Class = require('../models/class')

const {mutipleMongooseToObject} = require('../util/mongoose')
const {mongooseToObject} = require('../util/mongoose')

// Classes page
router.get('/myClasses', function(req, res, next) {
    Class.find({})
    .then(classes => {
      res.render('classes/myClasses', { 
        classes: mutipleMongooseToObject(classes)
       })
    })
    .catch(next)
});

// Create a new class
router.post('/myClasses', function(req, res, next) {
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

router.get('/edit/:id', function(req, res, next) {
      Class.findById(req.params.id)
      .then(classes => res.render('classes/edit', {
        classes: mongooseToObject(classes)
      }))
      .catch(next);
});

// Update a class
router.put('/:id', function(req, res, next) {
  Class.updateOne({ _id: req.params.id }, req.body)
      .then(() => res.redirect('/classes/myClasses'))
      .catch(next);
});

// Delete a class
router.delete('/:id', function(req, res, next) {
  Class.deleteOne({ _id: req.params.id })
      .then(() => res.redirect('/classes/myClasses'))
      .catch(next);
});

module.exports = router

