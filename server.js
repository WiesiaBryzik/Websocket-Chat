const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

const messages = [];
const users = [];

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
  socket.on('join', (user) => {
    const newUser = { name: user, uid: socket.id };
    users.push(newUser);
    console.log('user:', user);
    console.log('users:', users);
    const loginMessage = { author: 'Chat Box', content: '<i>' + newUser.name + ' has join the conversation!</i>'}
    messages.push(loginMessage);
    socket.broadcast.emit('message', loginMessage);
  });
  socket.on('message', (message) => {
    console.log('Oh, I\'ve got something from ' + socket.id);
    console.log(message);
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');
  
    for (let escapeUser of users) {
      if (escapeUser.uid === socket.id) {
      
      const exitMessage = { author: 'Chat Box', content: '<i>' + escapeUser.name + ' has left the conversation... :(!</i>'}
      messages.push(exitMessage);
      socket.broadcast.emit('message', exitMessage);

        users.splice(users.indexOf(escapeUser), 1);
        }
    }

  console.log('Active users in chat:', users);

  });
  console.log('I\'ve added a listener on message event \n');
});
