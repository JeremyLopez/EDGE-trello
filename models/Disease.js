var mongoose = require('mongoose');

var DiseaseSchema = new mongoose.Schema({
  name     : String,
	received : {type: Number, default: 0},
	smashed  : {type: Number, default: 0},
	chipped  : {type: Number, default: 0},
	complete : {type: Number, default: 0},
});

mongoose.model('Disease', DiseaseSchema);