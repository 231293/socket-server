const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var fs = require('fs');

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('newMessage', (msg) => {
    console.log('message: ' + msg);
    socket.emit('onMsgReceived', 'got it thanks');
  });

  socket.on('saveFile', (file) => {
    var buf = new Buffer.alloc(file.blob.length, file.blob, 'base64'); // decode
    fs.writeFile("c:/socket-files/" + file.name, buf, function (err) {
      if (err) {
        console.log("err", err);
      } else {
        console.log("File Saved");
      }
    });
    // console.log('file: ', file);
    // fs.writeFileSync(__dirname, file1);
    socket.emit('onFileReceived', `got file ${file.name}`);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});