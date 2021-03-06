var express = require('express');
var router = express.Router();

const authorize = require('src/_middleware/authorize');

const { getUserProfileFromSession, getCurrentUserIdFromReq } = require('src/_helpers/current-user');

const authSchemas = require('src/schemas/auth.schemas');
const authService = require('src/services/auth.service');

// Route functions
function registerAccount(req, res, next) {

  var newAccountData = req.body;

  authService.registerAccount(newAccountData).then(function(data) {

    res.status(201).send(data.toJson());

  })
  .catch(function(err) {

    res.status(400).json({
      message: err
    });

  });

}

function login(req, res, next) {

  var loginData = req.body;

  const session = req.session;

  authService.authenticateCredentials(loginData).then(function(user) {

    // Sucessfully logged in, send 204 to indicate success.

    session.user = {
      id: user.id
    };

    res.sendStatus(204);

  })
  .catch(function(err) {

    res.status(403).json({
      message: err
    });

  });
  
}

function logout(req, res, next)
{

  if(!!req.session)
  {

    req.session.destroy();

  }

  res.sendStatus(204);

}

function getCurrentUserProfile(req, res, next) {  

  getUserProfileFromSession(req).then(function(profile) {

    if(!!profile)
    {

      res.json(profile.toJson());

    }
    else
    {

      res.sendStatus(404);

    }

  });  
  
}

function updateCurrentUserProfile(req, res, next) {

  const currentUserId = getCurrentUserIdFromReq(req);
  const newProfileData = req.body;

  authService.updateUserProfile(currentUserId, newProfileData).then(() => {

    res.sendStatus(204);

  })
  .catch((err) => {

    console.error(err);

    res.sendStatus(500);

  });

}

// Routes registration
router.post('/register', authSchemas.registerAccountSchema, registerAccount);
router.post('/authenticate', authSchemas.authenticateSchema, login);
router.post('/logout', logout);

router.get('/me', authorize(), getCurrentUserProfile);
router.put('/me', authorize(), updateCurrentUserProfile);

module.exports = router;
