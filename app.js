var express=require('express');
var morgan = require('morgan');
var swig = require('swig');
var _ = require('underscore');
var routes = require('./routes');

var app = express();
app.listen(8484);
console.log('head to port 8484');

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');


app.use(morgan('dev'));
//app.use(routes);
app.use(express.static(__dirname + '/public'));








var movies = []
//stuff for sqlite
var fs = require('fs');
var file = __dirname + '/private/imdb-large.sqlite3.db';
console.log(file);
var exists = fs.existsSync(file);
console.log('does exist?', exists);

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(file);

db.serialize(function() {
	if(exists) {
		db.each("SELECT * FROM movies LIMIT 25;", function(err, row) {
			movies.push(row)
	 		console.log(row);
		}, function(err, results){


		});
	}
	db.close();
});



app.get('/', function(req, res) {

	// console.log(movies);
	res.render('index', {movies: movies});
});


app.get('/movie/:id',function(req,res){
	console.log('here');
	var roles = [];
	var db = new sqlite3.Database(file);
	db.serialize(function() {
		console.log('there');
		db.each("SELECT * FROM roles WHERE movie_id = " + req.params.id + " LIMIT 25;",
			function(err, row) {
				roles.push(row)
		 		console.log("roles:",row);
		}, function(err, results){
				console.log('end Error:', err);
				res.render('indexx',{roles:roles})
		});
	db.close();
	});
});



