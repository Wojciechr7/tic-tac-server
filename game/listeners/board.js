

var Attack = require('../dispatchers/board/attack');
var Messager = require('../dispatchers/board/messager');

var Board = function () {


    this.attack = new Attack();
    this.messager = new Messager();


    this.runListeners = function (socket, io, session) {

        socket.on('attack', function (square) {
            var attackParameters = {
                socket: socket,
                io: io,
                session: session,
                square: square
            };
            this.attack.exec(attackParameters);
        }.bind(this));

        socket.on('private-message', function (data) {
            this.messager.send(socket, io, session, data.msg);
        }.bind(this));


    };





};

module.exports = new Board();