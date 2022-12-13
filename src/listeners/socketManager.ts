import { Server, Socket } from 'socket.io';
import Logging from '../library/Logging';

const socketConnection = async (server: any) => {
  const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: 'http://localhost:3000',
    },
  });

  io.on('connection', (socket: Socket) => {
    Logging.info('<-- Connected to socket -->');

    socket.on('setup', (userData) => {
      socket.join(userData._id);
      socket.emit('Connected');
    });

    socket.on('join chat', (room) => {
      socket.join(room);
      Logging.info(`User joined room ${room}`);
    });

    socket.on('typing', (room) => {
      socket.in(room).emit('typing');
    });
    socket.on('typing stopped', (room) =>
      socket.in(room).emit('typing stopped')
    );

    socket.on('new message', (newMessage) => {
      let chat = newMessage.chat;
      if (!chat.users) return Logging.warn('No Users');

      chat.users.forEach((user: any) => {
        if (user._id === newMessage.sender._id) return;

        socket.in(user._id).emit('message received', newMessage);
      });
    });

    socket.off('setup', (userData) => {
      Logging.info('User Disconnected');
      socket.leave(userData._id);
    });
  });
};

export { socketConnection };
