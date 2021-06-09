
const { sharedSession } = require('src/_core/session');

const config = require('src/config/settings');

const socketIo = require('socket.io');
const uuid = require('uuid');

const roomService = require('src/services/room.service');
const authService = require('src/services/auth.service');

let io;

// Object where key is the room id and value is the viewer count
var roomMembers = {};

function listen(server)
{
  
  const io = socketIo(server, {
    cors: {
      origin: config.corsOrigin,
      methods: "*",
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });

  io.use(sharedSession);

  io.on("connection", (socket) => {

      //If the socket belongs to a valid user session
      if(!!socket.handshake.session.user)
      {

        // Join the socket to the user's pesonal channel. This is used to receive private messages
        socket.join(socket.handshake.session.user.id);

      }

      // Upon receiving the JoinRoom socket event
      socket.on('join-room', (data) => {

        var room = data.id;

        if(socket.room)
        {

          socket.leave(socket.room);

        }

        // Join the socket.io room to start subscribing to messages in that room
        socket.join('room-'+room);

        socket.room = room;

      });  
      
      socket.on('leave-room', (data) => {

        var room = data.id;

        socket.leave('room-'+room);

        socket.room = undefined;

      });

      socket.on('chat-message-sent', (data) => {

        const { roomId, message } = data;

        if(!!socket.handshake.session.user)
        {

          const currentUserId = socket.handshake.session.user.id;

          if(!!message)
          {

            authService.getUserById(currentUserId).then(function(user) {
  
              io.to('room-'+roomId).emit('chat-message', {
                message: message,
                sender: {
                  userId: currentUserId,
                  ...user.toJson()
                },
                id: uuid.v4()
              });
    
            });   

          }         

        }             

      });

  });

  setInterval(() => { updateViewerCounts(io) }, 5000);

  return io;

}

function updateViewerCounts(io) {

  const rooms = io.sockets.adapter.rooms;

  let members = {};

  if(!!rooms)
  {

    for(const [key, value] of rooms.entries())
    {

      if(key.toString().indexOf('room-') !== -1)
      {

        members[key] = value.size;

        // For the open room, emit to the current viewers the updated viewer count
        io.to(key.toString()).emit('viewer-count', {
          viewerCount: value.size
        });

        // Remove the room- prefix from the channel name, to get the room uuid
        const roomId = key.toString().replace('room-', '');

        // Also get the room details and
        roomService.getRoomDetails(roomId).then((room) => {

          io.to(key.toString()).emit('room-data-update', {
            room: room
          });

        }); 

      }      

    }

  }

  roomMembers = members;

}

module.exports = {
  listen
};