var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

//static content
app.use(express.static(path.join(__dirname, './static')));
app.use(bodyParser.urlencoded({extended: true}));

//ejs and views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
var chatHistory = [];
//root route to render index.ejs view
app.get('/', function(req, res){
	console.log(chatHistory);
	res.render('index', {chat: chatHistory});
})


//tell the express app to listen on port, must be at bottom
var server = app.listen(8888, function(){
	console.log("listening on port 8888");
})

var io = require('socket.io').listen(server)
io.sockets.on('connection', function(socket){
	console.log("Sockets Online");
	console.log(socket.id);
	var user = {};
	
	

	socket.on("created_new_user", function(data){
		data.sessionId = socket.id;
	 	// puts info in user object
	 	user.name = data.name;
	 	user.sessionID = data.sessionId;
	 	console.log(chatHistory);
	 	console.log(user);	 	
	 	io.emit('joining_room', data);
	 });

	socket.on("posting_content", function(comment){
		//puts comment in user object
		chatHistory.push(user.name+" said: "+comment.comment);
		user.comment = comment.comment;
		console.log(user);
		console.log(chatHistory);
		io.emit('global_message', user);
	})
});