var express = require('express');
var app = express();
app.use(express.static("./public"));
var http = require('http').Server(app);
var io = require('socket.io')(http);

var userColors = require('./colors.js');

var users = [];

io.on('connection', function(socket){
  //After user submits an alias
  socket.on('user:enter', function(alias){

    //add the current socket user to the users array
    users.push(alias);
    //console.log('User CONNECTED');

    //send the new user their name and list of users
    socket.broadcast.emit('initialize', {
      name: alias,
      users: users
    });
    socket.emit('initialize', {
      users: users
    })

    // notify other sockets that a new user has joined
    socket.broadcast.emit('user:join', {
      name: alias
    });

    socket.on('send:message', function(data){
      io.emit('send:message', {
        user: alias,
        text: data.text,
        color: userColors.getColor(alias)
      });
    });

    socket.on('color:change', function(data){
      userColors.addUser(alias, data.color);
    });

    //User leaves chat room
    socket.on('disconnect', function(){
      //console.log('User DISCONNECTED');
      //removes socket user from the user list
      var index = users.indexOf(alias)
      users.splice(index,1);

      socket.broadcast.emit('user:left', {
        name: alias,
        users: users
      });
    });

  });

});

//This is setup of routes to go from AliasPicker to AppChat
app.get('/*', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
