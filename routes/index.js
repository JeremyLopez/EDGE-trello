var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var Disease = mongoose.model('Disease');
//var Comment = mongoose.model('Comment');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/diseases', function(req, res, next) {
	console.log("here");
  Disease.find(function(err, diseases){
    if(err){ return next(err); }

    res.json(diseases);
  });
});

// Unsure if this works
router.get("/diseases/:id", function(req, res, next) {
	Disease.findOne({_id: req.params.id}, function(err, disease) {
		if (err){ return next(err); }
		console.log(disease.name);
	});
});

//Definitely works
router.post('/diseases', function(req, res, next) {
  var disease = new Disease(req.body);

  disease.save(function(err, diseases){
    if(err){ return next(err); }

    res.json(diseases);
  });
});


// Not working
router.delete('/diseases/:id', function(req, res, next) {
	console.log(req);
	Disease.remove({ _id: req.params.id }, 
		function(err, diseases) {
			if (err) { 
				return next(err); 
			}
		
			res.json(diseases);
	});
});

//router.route('/diseases/:id').delete(function(req, res) {
//	_id: req.params.id
//	console.log(req);
//});



//router.param('disease', function(req, res, next, id) {
//	var query = Disease.findById(id);
//	
//	query.exec(function(err, disease) {
//		if (err) { return next(err); }
//		if (!disease) { return next(new Error('can\'t find disease')); }
//		
//		req.disease = disease;
//		return next();
//	});
//});



module.exports = router;

