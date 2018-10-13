var express = require('express');
var router = express.Router();

var game = require('../game/game.js');


router.get('/', function(req, res, next) {
    res.send(game.players);
});

router.post('/', function(req, res, next) {
    console.log(req);
});


module.exports = router;
