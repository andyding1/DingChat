var express = require('express');
var app = express();
app.use(express.static("./public"));
var http = require('http').Server(app);
var io = require('socket.io')(http);

var users = [];

io.on('connection', function(socket){
  console.log('User CONNECTED');
  socket.broadcast.emit('initialize', {
    name: '',
    users: users
  });
  //After user submits an alias
  socket.on('user:enter', function(alias){
    users.push(alias);
    //gets user list and emits to everyone
    io.emit('getUserList', {
      users: users
    })
    //gets specific user alias and sets as name to just that socket
    socket.emit('getUser', {
      name: alias
    });
    //User leaves chat room
    socket.on('disconnect', function(){
      console.log('User DISCONNECTED');
      socket.broadcast.emit('user:left', {
        users: users,
        name: alias
      });
    });

  });

  socket.on('send:message', function(msg){
    io.emit('send:message', msg);
  });


});


app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
