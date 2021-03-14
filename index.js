var express = require('express')
  , http = require('http');
  var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
var mqtt = require('mqtt')
var request = require("request");
var requestify = require('requestify');
var options = {
  username: 'omar',
  password: 'Dubai1270',
};

//const app = express()
const port = 3000

app.use(express.static('public'));
//app.set('view engine','hbs');


var client  = mqtt.connect('mqtt://itomated.com',options)

client.on('connect', function () {
  client.subscribe('/2631135/light', function (err) {
  if (!err) {
    client.publish('/2631135/light', '{"r":100,"g":30,"b":100,"x":1,"y":0,"action":"color"}')
  }
})

})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
//client.end()
})

//connection.connect();

app.get('/button', (req, res) =>   res.sendFile(__dirname + '/button.html'))
app.get('/video', (req, res) =>{
  res.sendFile(__dirname + '/index.html')
});


server.listen(port, () => console.log(`Example app listening on port ${port}!`))
io.on('connection', function(socket){
  socket.on('message', function(msg){
     io.emit('message', msg);
    console.log('message: ' + msg);
  });
  socket.on('button', function(msg){
      io.emit('button', msg);
      obj={"r":100,"g":30,"b":100,"x":msg.id,"y":0,"action":"color"};
      client.publish('/2631135/light', JSON.stringify(obj))
      console.log('buttonxx: ' + msg.id);
  });
});
