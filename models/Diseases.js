var mongoose = require('mongoose');

var DiseaseSchema = new mongoose.Schema({
  name     : String,
	received : {type: Number, default: 0},
	smashed  : {type: Number, default: 0},
	chipped  : {type: Number, default: 0},
	complete : {type: Number, default: 0},
	
//  link: String,
//  upvotes: {type: Number, default: 0},
//  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

mongoose.model('Disease', DiseaseSchema);