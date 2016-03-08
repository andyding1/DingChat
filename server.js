var express = require('express');
var app = express();
app.use(express.static("./public"));
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

  socket.on('send:message', function(msg){
    console.log(msg);
    io.emit('send:message', msg);
  });
});



app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

http.listen(8080, function(){
  console.log('listening on *:8080');
});
