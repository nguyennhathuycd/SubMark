const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('home', {style: 'main.css'})
});

module.exports = router