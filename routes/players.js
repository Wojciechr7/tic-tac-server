var express = require('express');
var router = express.Router();

var game = require('../game/game.js');


router.get('/', function(req, res, next) {
    res.send(game.PM.players.map(function(player) {
        return {
            name: player.name,
            id: player.id
        };
    }));
});




module.exports = router;
