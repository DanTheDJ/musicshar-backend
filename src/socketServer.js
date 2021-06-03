
const { sharedSession } = require('src/_core/session');

const config = require('src/config/settings');

const socketIo = require('socket.io');
const uuid = require('uuid');

let io;

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

      console.log('socket-user:', socket.handshake.session.user);

      //If the socket belongs to a valid user session
      if(!!socket.handshake.session.user)
      {

        console.log('User #' + socket.handshake.session.user.id + ' Connected: ' + socket.handshake.session.user);

        // Join the socket to the user's pesonal channel. This is used to receive private messages
        socket.join(socket.handshake.session.user.id);

      }

      console.log('socket connected');

      // Upon receiving the JoinRoom socket event
      socket.on('join-room', (data) => {

        var room = data.id;

        if(socket.room)
        {

          socket.leave(socket.room);

        }

        console.log('join-room', data);

        // Join the socket.io room to start subscribing to messages in that room
        socket.join('room-'+room);

        socket.room = room;

      });  
      
      socket.on('leave-room', (data) => {

        var room = data.id;

        socket.leave('room-'+room);

        socket.room = undefined;

      });

  });

  setInterval(() => {

    io.to('room-e09cbfa3-3907-4d89-bd6b-15bcb7348eff').emit('chat-message', {
      message: 'hello world',
      id: uuid.v4()
    });

  }, 10000);

  setInterval(() => { updateViewerCounts(io) }, 5000);

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

        io.to(key.toString()).emit('viewer-count', {
          viewerCount: value.size
        });

      }      

    }

    // rooms.forEach((value, key, map) => {

    //   console.log(key);

    //   // If room key includes room prefix
    //   if(key.indexOf('room-') !== -1)
    //   {

    //     console.log(key, value);

    //   }     

    // });

  }

  roomMembers = members;

  console.log(roomMembers);
  
  //console.log(rooms);

}

module.exports = {
  listen
};


// io.on("connection", (socket) => {

//   // If the socket belongs to a valid user session
//   // if(!!socket.handshake.session.user)
//   // {

//   //   console.log('User #' + socket.handshake.session.user.id + ' Connected: ' + socket.handshake.session.user.name);

//   //   // Join the socket to the user's pesonal channel. This is used to receive private messages
//   //   socket.join(socket.handshake.session.user.id);

//   // }


//     console.log('socket connected');
// });

// //io.use(sharedsession(session));



// function setupSession(session)
// {

//   // Share session with io sockets
 
//   io.use(sharedsession(session));

// }

// module.exports = {
//     setupSession
// };