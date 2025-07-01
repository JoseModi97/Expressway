var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express Home' });
});

/* GET dog gallery page. */
router.get('/dogs/gallery', function(req, res, next) {
  res.render('dog-grid', { title: 'Dog Image Gallery' });
});

module.exports = router;
