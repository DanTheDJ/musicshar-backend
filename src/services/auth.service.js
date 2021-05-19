const db = require('src/models/index');
const bcrypt = require('bcrypt');

const User = db.User;
const Op = db.Sequelize.Op;

async function registerAccount(newAccountData)
{

    return new Promise(function(resolve, reject) {


        var hash = bcrypt.hashSync(newAccountData.password, 12);

        var userData = {
            username: newAccountData.username,
            name: newAccountData.name,
            email: newAccountData.email,
            password: hash
        };
    
        User.create(userData)
        .then(data => {
            resolve(data);
        })
        .catch(err => {
            reject(err.message || "Error occurred while creating the user account");
        });

    });

};

module.exports = {
    registerAccount
};