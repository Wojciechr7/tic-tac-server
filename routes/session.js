var express = require('express');
var router = express.Router();

var game = require('../game/game.js');


router.get('/', function(req, res, next) {
    res.send(game.session.items);
});




module.exports = router;
