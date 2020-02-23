const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

const messages = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/index.html'));
  });
  
app.use((req, res) => {
    res.status(404).send({ message: 'Not found...' });
})

const server = app.listen(8000, () => {
  console.log('Server is running on Port:', 8000)
});
const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.on('message', () => { console.log('Oh, I\'ve got something from ' + socket.id) });
  socket.on('disconnect', () => { console.log('Oh, socket ' + socket.id + ' has left') });
  console.log('I\'ve added a listener on message event \n');
});
  