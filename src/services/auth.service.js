const db = require('src/models/index');
const bcrypt = require('bcrypt');

const User = db.User;
const Op = db.Sequelize.Op;

async function registerAccount(newAccountData)
{

    return new Promise(function(resolve, reject) {

        var hash = bcrypt.hashSync(newAccountData.password, 12);

        var userData = {
            username: newAccountData.username.toLowerCase(),
            name: newAccountData.name,
            email: newAccountData.email.toLowerCase(),
            password: hash
        };

        // Check there isn't an existing user with same email or username.
        User.findAll({
            where: {
                [Op.or]: [
                    {
                        email: userData.email
                    },
                    {
                        username: userData.username
                    }
                ]
            }
        }).then(function(res) {

            if(res.length == 0)
            {

                User.create(userData)
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err.message || "Error occurred while creating the user account");
                });

            }
            else
            {

                if(res[0].username == userData.username)
                {

                    reject('Username is already taken.');

                }
                else if(res[0].email == userData.email)
                {

                    reject('Email is already taken.');

                }

            }

        })
        .catch((err) => {
            reject(err);
        });

    });

};

async function authenticateCredentials(loginData)
{

    return new Promise(function(resolve, reject) {

        // Check there isn't an existing user with same email or username.
        User.findAll({
            where: {
                email: loginData.email
            }
        }).then(function(res) {

            if(res.length != 0)
            {

                const user = res[0];

                if(!!user && bcrypt.compareSync(loginData.password, user.password))
                {

                    resolve(user);

                }
                else
                {

                    reject('Invalid credentials');

                }

            }
            else
            {

                reject('Invalid credentials');

            }
        })
        .catch((err) => {
            reject(err);
        });

    });

}

async function getUserById(userId)
{

    return new Promise(function(resolve, reject) {

        User.findByPk(userId).then(function(user) {
    
            resolve(user);
    
        })
        .catch(function(err) {
    
            console.error(err);
            
            reject(err);
    
        });

    });   

}

async function updateUserProfile(userId, newProfileData)
{

    return new Promise(function(resolve, reject) {

        User.findByPk(userId).then(function(user) {

            user.name = newProfileData.name;
            user.email = newProfileData.email;

            user.save().then(() => {
                resolve();
            });
    
        })
        .catch(function(err) {
    
            console.error(err);
            
            reject(err);
    
        });

    });   

}

module.exports = {
    registerAccount,
    authenticateCredentials,
    getUserById,
    updateUserProfile
};