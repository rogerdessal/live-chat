const io = require('socket.io')(3000)

const users = {}

io.on('connection', socket => {

  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.emit('initialize-members', users);
    socket.broadcast.emit('user-connected', { name: name, id: socket.id });
  })

  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', { name: users[socket.id], id: [socket.id] })
    delete users[socket.id]
  })
})