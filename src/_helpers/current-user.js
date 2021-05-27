const db = require('src/models/index');

const User = db.User;
const Op = db.Sequelize.Op;

function getCurrentUserIdFromReq(req)
{

    const session = req.session;

    if(!!req.session && !!req.session.userId)
    {

        return req.session.userId;

    }

    return null;

}

function getUserProfileFromSession(req)
{

    return new Promise(function(resolve, reject) {

        const currentUserId = getCurrentUserIdFromReq(req);

        if(!!currentUserId)
        {
    
            User.findByPk(currentUserId).then(function(user) {
    
                resolve(user);
    
            })
            .catch(function(err) {
    
                console.error(err);
                
                reject(err);
    
            });
    
        }
        else
        {

            resolve(null);

        }

    });

}

module.exports = {
    getCurrentUserIdFromReq,
    getUserProfileFromSession    
};