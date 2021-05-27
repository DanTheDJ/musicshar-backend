const db = require('src/models/index');
const bcrypt = require('bcrypt');

const User = db.User;
const Room = db.Room;
const Op = db.Sequelize.Op;

async function createRoom(newRoomData, creatingUserId)
{

    return new Promise(function(resolve, reject) {

        var roomData = {
            name: newRoomData.name,
            ownerUserId: creatingUserId
        };

        Room.create(roomData)
        .then(data => {
            resolve(data);
        })
        .catch(err => {
            console.error(err);
            reject(err.message || "Error occurred while creating the room.");
        });

    });

};

async function getRoomDetails(id)
{

    return new Promise(function(resolve, reject) {

        Room.findByPk(id).then(function(room) {
    
            resolve(room);

        })
        .catch(function(err) {

            console.error(err);
            
            reject(err);

        });

    });

}

async function getAvailableRooms(currentUserId, stateFilter)
{

    return new Promise(function(resolve, reject) {

        // Find rooms where privacy is public or the current user has access

        Room.findAll().then((rooms) => {

            resolve(rooms);

        })
        .catch(function(err) {

            console.error(err);
            
            reject(err);

        });

    });

}

module.exports = {
    createRoom,
    getRoomDetails,
    getAvailableRooms
};