var express = require('express');
var router = express.Router();

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

// Routes registration
router.post('/register', authSchemas.registerAccountSchema, registerAccount);

module.exports = router;
