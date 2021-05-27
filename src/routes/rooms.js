var express = require('express');
var router = express.Router();

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

// Routes registration
router.post('/', roomSchemas.createRoomSchema, createRoom);
router.get('/', getRooms);
router.get('/:id', getRoomDetails);

module.exports = router;
