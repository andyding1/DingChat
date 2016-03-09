var express = require('express');
var app = express();
app.use(express.static("./public"));
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = [];

io.on('connection', function(socket){

  //After user submits an alias
  socket.on('user:enter', function(alias){
    console.log('User CONNECTED');
    //send the new user their name and list of users
    socket.broadcast.emit('initialize', {
      name: alias,
      users: users
    });

    // notify other sockets that a new user has joined
    socket.broadcast.emit('user:join', {
      name: alias
    });

    socket.on('send:message', function(data){
      io.emit('send:message', {
        user: alias,
        text: data.text
      });
    });

    //User leaves chat room
    socket.on('disconnect', function(){
      console.log('User DISCONNECTED');
      socket.broadcast.emit('user:left', {
        name: alias
      });
    });

  });




});


app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
