const bcrypt = require('bcrypt');

async function registerAccount(newAccountData)
{

    bcrypt.hash(newAccountData.password, 12).then(function(hash) {

        var data = {
            username: newAccountData.username,
            name: newAccountData.name,
            email: newAccountData.email,
            password: hash
        };

        console.log(data);
    
        return data;

        var createdAccount = null;

        if(!!createdAccount)
        {

            return createdAccount;

        }

        throw 'Error creating user';

    }).catch(function(error) {

        throw error;

    });

};

module.exports = {
    registerAccount
};