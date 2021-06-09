// Middleware function to check if user is authenticated. If no valid session, then return an error.

function authorize()
{

    return [

        async (req, res, next) => {

            const user = req.session.user;
            
            if(!user)
            {

                return res.status(401).json({ message: 'Unauthorized'});

            }            

            next();

        }

    ];

}

module.exports = authorize;