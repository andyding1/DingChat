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

  socket.on('user:enter', function(alias){
    console.log(socket.id);
    users.push(alias);
    console.log(users);

    io.emit('getUserList', {
      users: users
    })

    socket.emit('getUser', {
      name: alias
    });

  });

  socket.on('send:message', function(msg){
    io.emit('send:message', msg);
  });

  // socket.on('disconnect', function(){
  //   console.log('User DISCONNECTED');
  //   socket.broadcast.emit('user:left', {
  //     users: users
  //   });
  // });

});


app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
