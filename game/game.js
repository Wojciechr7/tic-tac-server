

var Session = require('./dispatchers/lobby/session');
var Lobby = require('./listeners/lobby');
var Board = require('./listeners/board');


var game = function () {


    this.session = new Session();




    this.runSocketListeners = function (socket, io) {

            Lobby.runListeners(socket, io, this.session);

            Board.runListeners(socket, io, this.session);



    };






};


module.exports = new game();