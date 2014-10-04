//testing commit 2

/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var passport = require("passport");
var config = require("./config/config.js");	
var Firebase = require('firebase');
var fs = require("fs");
var mongoose = require('mongoose');

mongoose.connect(config.dbdev, function(err){
    if(err){
      console.log(err);
    }else{
      console.log('Connected to Mongodb.');
    }
  });
var sentiment = require("sentiment");
var url = "",
Message = require("./models/message.js"),
MessageFix = require('./models/messageFix.js');
MessageLink = require("./models/messageLink.js");

var app = express();



// development only
if ('development' == app.get('env')) {
	url = config.dbdev;
  app.use(express.errorHandler());
}else{
	url = config.db;
}

mongoose.connect(url, function(err){
    if(err){
    	console.log("CANT CONNECT TO MONGODB");
      console.log(err);
    }else{
      console.log('Connected to Mongodb.');
    }
 });


// all environments
app.set('port', process.env.PORT || 8000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));	
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser('Intro HCI secret key'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var fb = new Firebase('https://flickering-fire-2908.firebaseio.com/') ;

if(fb) {
	console.log('firebase connection established');
}

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get("/", function(req,res){
	res.render("index");
});

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

app.get("/suggestMessage", function(req,res){
	var sentiment = require('sentiment');
	var message = req.query.message, 
		sentimentResult = sentiment(message),
		scoreBody = new Message({message : message,
		 score : sentimentResult.score, tokens : sentimentResult.tokens}),
		fbScore = {
			message: message,
			score: sentimentResult.score,
			tokens: sentimentResult.tokens
		};

	sentimentResult.tokens.forEach(function(e){
		MessageLink.findOne({key : e}, function(err, data){
			console.log(err, data);
			if(data == null){
				var msg = new MessageLink({	key : e,
								familyStrings : [message]});
				msg.save(function(err){console.log(err)});
			}else{
				if(data.familyStrings
					.map(function(e){return e.toLowerCase()})
					.indexOf(message.toLowerCase()) < 0){
						data.familyStrings.push(message);
						data.save(function(err){console.log(err)});			
				}

			}
		})
	});

	fb.push(fbScore, function() {
		console.log('word added');
	});

	scoreBody.save(function(err,res){
		console.log(err,res);
	});

	var frequency = {};
	sentimentResult.tokens.forEach(function(e) {
		MessageLink.findOne({key: e}, function(err, data) {
			if(data == null) {
				//
			} else {
				data.familyStrings.forEach(function(match) {
					if(frequency[match.toLowerCase()]) {
						frequency[match.toLowerCase()]++;
					} else {
						frequency[match.toLowerCase()] = 1;
					}
				});
			}
		})
	});

	var highest;
	// for(var key in frequency) {
	// 	if(!highest || frequency[key]) {
	// 		 = ;
	// 	}
	// }

	// if(sentimentResult.score < 0) {
	// 	MessageFix.findOne({message: message}, function(err, fix) {
	// 		console.log(fix)
	// 		if(fix == null) {
	// 			res.end('censored');
	// 		} else {
	// 			res.end(fix.messageFix);
	// 		}
	// 	})
	// } else {
	// 	res.end(req.query.message);
	// }
});

app.get("/messages", function(req,res){
	Message.find({}, function(err,data){
		res.json(data);
	});
});

app.post('/positiveMessage', function(req, res) {
	console.log(req.body);
	MessageFix.find({message: req.body.oldMessage}, function(err, data) {
		if(data.length === 0) {
			var positiveMessage = new MessageFix
			({message: req.body.oldMessage, messageFix: req.body.message});
			positiveMessage.save();
			res.end();
		}else{
			res.end();
		}
	});

});

