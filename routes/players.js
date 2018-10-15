var express = require('express');
var router = express.Router();

var game = require('../game/game.js');

var Lobby = require('../game/listeners/lobby');


router.get('/', function(req, res, next) {
    res.send(Lobby.PM.players.map(function(player) {
        return {
            name: player.name,
            id: player.id
        };
    }));
});




module.exports = router;
