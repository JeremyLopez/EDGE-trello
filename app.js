var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

require('./models/Disease');
var routes = require('./routes/index');
var users = require('./routes/users');




var app = express();





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err // need to hange back to {}
  });
});


module.exports = app;

//mongodb://heroku_5ngk7d5h:a4lp92pri9vriu4gku17lju9u2@ds049935.mongolab.com:49935/heroku_5ngk7d5h

//var Disease = mongoose.model('Disease', DiseaseSchema);

//var seedData = {
//		name: "test",
//		received : 1,
//		smashed  : 2,
//		chipped  : 3,
//		complete : 4
//}

//var tester = new Disease(seedData);
//tester.save(function (err) {if (err) console.log("err: ", err)});

//var uristring =
//    process.env.MONGOLAB_URI ||
//    process.env.MONGOHQ_URL ||
//    'mongodb://localhost/EDGE';

var uri = 'mongodb://heroku_5ngk7d5h:a4lp92pri9vriu4gku17lju9u2@ds049935.mongolab.com:49935/heroku_5ngk7d5h';

console.log("blah");

mongoose.connect(uri, function (err, res) {
	if (err) {
		console.log ('ERROR connecting to: ' + uri + '. ' + err);
	} else {
		console.log ('Succeeded connected to: ' + uri);
	}
});