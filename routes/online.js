var express = require('express');
var router = express.Router();

var Lobby = require('../game/listeners/lobby');


router.get('/', function(req, res, next) {
    res.json(Lobby.connection.allClients.length);
});




module.exports = router;
