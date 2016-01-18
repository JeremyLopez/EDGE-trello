var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Disease = mongoose.model('Disease');
//var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/diseases', function(req, res, next) {
  Disease.find(function(err, diseases){
    if(err){ return next(err); }

    res.json(diseases);
  });
});

router.post('/diseases', function(req, res, next) {
  var disease = new Disease(req.body);

  disease.save(function(err, disease){
    if(err){ return next(err); }

    res.json(disease);
  });
});

module.exports = router;

