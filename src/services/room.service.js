const db = require('src/models/index');
const bcrypt = require('bcrypt');

const Room = db.Room;
const RoomSource = db.RoomSource;

const Op = db.Sequelize.Op;

async function createRoom(newRoomData, creatingUserId)
{

    return new Promise(function(resolve, reject) {

        var roomData = {
            name: newRoomData.name,
            ownerUserId: creatingUserId,
            isPublic: newRoomData.privacy == 'public'
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

        Room.findByPk(id, {
            include: ['ownerUser', 'roomSource']
        }).then(function(room) {
    
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

        Room.findAll({ 
            include: 'ownerUser',
            where: {
                [Op.or]: [
                    {
                        isPublic: true
                    },
                    {
                        ownerUserId: currentUserId
                    }
                ]
                
            } 
            
        }).then((rooms) => {

            resolve(rooms);

        })
        .catch(function(err) {

            console.error(err);
            
            reject(err);

        });

    });

}

async function closeRoom(currentUserId, roomId)
{

    return new Promise(function(resolve, reject) {

        Room.findByPk(roomId, {
            include: 'ownerUser'
        }).then(function(room) {

            if(!!room)
            {

                // Check that the room owner is the user attempting to submit it
                if(room.ownerUser.id === currentUserId)
                {

                    room.destroy().then(() => {

                        resolve();

                    });

                }
                else
                {

                    reject('You must be the owner of a room to delete it.');

                }   

            }
            else
            {

                resolve();
                
            }                       

        })
        .catch(function(err) {

            console.error(err);
            
            reject(err);

        });

    });

}

async function updateRoomSource(currentUserId, roomId, sourceData)
{

    return new Promise(function(resolve, reject) {

        Room.findByPk(roomId, {
            include: 'ownerUser'
        }).then(function(room) {

            if(!!room)
            {

                // Check that the room owner is the user attempting to submit it
                if(room.ownerUser.id === currentUserId)
                {

                    const roomSourceData = {
                        type: sourceData.type,
                        data: sourceData.data
                    };

                    RoomSource.create(roomSourceData)
                    .then(createdRoomSource => {

                        room.roomSourceId = createdRoomSource.id;

                        room.save().then(() => {
                            resolve();
                        });

                    })
                    .catch(err => {
                        console.error(err);
                        reject(err.message || "Error occurred while creating the room.");
                    });

                }
                else
                {

                    reject('You must be the owner of a room to update the source.');

                }   

            }
            else
            {

                resolve();
                
            }                       

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
    getAvailableRooms,
    closeRoom,
    updateRoomSource
};