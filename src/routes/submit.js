var express = require('express');
var router = express.Router();

// GET for logout logout
router.get('/', function (req, res, next) {
    res.render('submit', {assignments: true, style: "submit.css"})
});

module.exports = router