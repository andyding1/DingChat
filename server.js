var express = require('express');
var app = express();
app.use(express.static(__dirname));
var http = require('http').Server(app);
var io = require('socket.io')(http);

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });


io.on('connection', function(socket){
  console.log('User CONNECTED');
  socket.on('disconnect', function(){
    console.log('User DISCONNECTED');
  });
});


app.get('/', function(req, res){
  res.sendFile(__dirname + '/src/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
