var express = require('express');
var router = express.Router();

const authorize = require('src/_middleware/authorize');

const { getCurrentUserIdFromReq } = require('src/_helpers/current-user');

const roomSchemas = require('src/schemas/room.schemas');
const roomService = require('src/services/room.service');

// Route functions
function createRoom(req, res, next) {

  var newRoomData = req.body;

  const creatingUserId = getCurrentUserIdFromReq(req);

  roomService.createRoom(newRoomData, creatingUserId).then(function(data) {

    res.status(201).send(data.toJson());

  })
  .catch(function(err) {

    console.error(err);

    res.status(400).json({
      message: err
    });

  });

}

function getRoomDetails(req, res, next) {

  const { id } = req.params;

  if(!!id)
  {

    roomService.getRoomDetails(id).then(function(data) {

      res.status(201).send(data.toJson());
  
    })
    .catch(function(err) {
  
      console.error(err);
  
      res.status(400).json({
        message: err
      });
  
    });

  }
  else
  {
  
    res.status(400).json({
      message: err
    });

  }

}

function getRooms(req, res, next) {

  const { state } = req.params;

  const currentUserId = getCurrentUserIdFromReq(req);

  roomService.getAvailableRooms(currentUserId, state).then(function(rooms) {

    res.send(rooms.map(function(room) {

      return room.toJson();

    }));

  }).catch(function(err) {
  
    console.error(err);

    res.status(400).json({
      message: err
    });

  });

}

function closeRoom(req, res, next)
{

  const currentUserId = getCurrentUserIdFromReq(req);
  const roomId = req.params.id;

  roomService.closeRoom(currentUserId, roomId).then(function(data) {

    // Emit room closed to connected sockets
    req.app.io.to('room-'+roomId).emit('room-closed');

    res.sendStatus(204);

  })
  .catch(function(err) {

    console.error(err);

    res.status(400).json({
      message: err
    });

  });

}

function updateRoomSource(req, res, next)
{

  const currentUserId = getCurrentUserIdFromReq(req);
  const roomId = req.params.id;
  const sourceData = req.body;

  roomService.updateRoomSource(currentUserId, roomId, sourceData).then(function(data) {

    res.sendStatus(204);

  })
  .catch(function(err) {

    console.error(err);

    res.status(400).json({
      message: err
    });

  });

}

// Routes registration
router.post('/', [authorize(), roomSchemas.createRoomSchema], createRoom);
router.get('/', authorize(), getRooms);
router.get('/:id', authorize(), getRoomDetails);

router.put('/:id/source', authorize(), updateRoomSource);

router.delete('/:id', authorize(), closeRoom);

module.exports = router;
