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

module.exports = {
    registerAccount
};