function IndexModel(ViewModel){
	var self = this;
  self.ViewModel = ViewModel;
 // var socket = io.connect("http://localhost:8000");
	var socket = io.connect(location.origin.replace(/^http/, 'ws'));
  	socket.on('enrollment', function (data) {
      console.log(data);
    	self.ViewModel.updateClass(data.id, data.count);
  });

  	self.GetClasses = function(callback){
  		callback(mockDB);
  	}

  	self.GetEnrolledClasses = function(id, callback){
  		callback([]);
  	}

  	self.Enroll = function(id, enrollment){
  		$.post("/enrollments", {id : id, count : enrollment});
  	}


  	var mockDB = [
  	{
  		id : 0,
  		name : "CSE 150 - Introduction to Artificial Intelligence: Search and Reasoning",
  		enrollment : ko.observable(0),
  		max_enrollment : 50,
  		instructor : "Sanjoy Dasgupta",
      group : "Artificial Intelligence"
  	},
  	{
  		id : 1,
  		name : "CSE 151 - Introduction to Artificial Intelligence: Statistical Approach",
  		enrollment : ko.observable(0),
  		max_enrollment : 50,
  		instructor : "Lawrence Saul",
      group : "Artificial Intelligence"
  	},
  	{
  		id : 2,
  		name : "CSE 152 - Introduction to Computer Vision",
  		enrollment : ko.observable(0),
  		max_enrollment : 50,
  		instructor : "Yoav Freund",
      group : "Artificial Intelligence"
  	},
  	{
  		id : 3,
  		name : "CSE 166 - Image Processing",
  		enrollment : ko.observable(0),
  		max_enrollment : 50,
  		instructor : "Charles Elkan",
      group : "Artificial Intelligence"
  	},
  	{
  		id : 50,
  		name : "CSE 181 - Molecular Sequence Analysis",
  		enrollment : ko.observable(0),
  		max_enrollment : 50,
  		instructor : "Pavel Pevzner",
      group : "Bioinformatics"
  	},
  	{
  		id : 5,
  		name : "CSE 182 - Biological Databases",
  		enrollment : ko.observable(0),
  		max_enrollment : 50,
  		instructor : "Vineet Bafna",
      group : "Bioinformatics"
  	},
  	{
  		id : 6,
  		name : "CSE112 - Advanced Software Engineering",
  		enrollment : ko.observable(0),
  		max_enrollment : 50,
  		instructor : "Bill Griswald",
      group : "Software Engineering"
  	},
  	{
  		id : 7,
  		name : "CSE 118 - Ubiquitous Computing",
  		enrollment : ko.observable(0),
  		max_enrollment : 50,
  		instructor : "Gary Gillespie",
      group : "Software Engineering"
  	},
  	{
  		id : 8,
  		name : "CSE 125 - Software System Design and Implementation",
  		enrollment : ko.observable(0),
  		max_enrollment : 50,
  		instructor : "Rick Ord",
      group : "Software Engineering"
  	},
	{
  		id : 9,
  		name : "CSE 135 - Server-side Web Applications",
  		enrollment : ko.observable(0),
  		max_enrollment : 50,
  		instructor : "That guy named Yannis",
      group : "Software Engineering"
  	},
	{
  		id : 10,
  		name : "CSE107 - Introduction to Modern Cryptography",
  		enrollment : ko.observable(0),
  		max_enrollment : 50,
  		instructor : "Mihir Bellare",
      group : "Software Engineering"
  	}];


}