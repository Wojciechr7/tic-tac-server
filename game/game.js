var Player = require('./player.js');

var game = function() {
    this.players = [new Player('janek', 1), new Player('pawel', 2)];
};


module.exports = new game();