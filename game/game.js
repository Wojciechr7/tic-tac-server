
var Connection = require('./dispatchers/connection');
var PlayerManager = require('./dispatchers/player-manager');
var Messager = require('./dispatchers/messager');
var Session = require('./dispatchers/session');


var game = function () {

    this.connection = new Connection();
    this.PM = new PlayerManager();
    this.messager = new Messager();
    this.session = new Session();





    this.runSocketListeners = function (socket, io) {

        this.connection.onConnect(socket, io);

        socket.on('disconnect', function () {
            this.connection.onDisconnect(socket, io);
            this.PM.removePlayer(socket, io);
        }.bind(this));

        socket.on('add-player', function (name) {
            this.PM.addPlayer(socket, io, name);
        }.bind(this));

        socket.on('remove-player', function () {
            this.PM.removePlayer(socket, io);
        }.bind(this));

        socket.on('invite-player', function (data) {
            this.PM.invitePlayer(socket, io, data, this.session.items);
        }.bind(this));

        socket.on('accept-invite', function (data) {

            io.to(data.from.socket).emit('handshake', data);
        }.bind(this));

        socket.on('cancel-invite', function (data) {
            this.session.removeSession(data);
        }.bind(this));

        socket.on('leave-game', function () {
            this.session.removeSessionDataless(socket);
        }.bind(this));

        socket.on('send-message', function (data) {
            if (this.PM.inLobby(socket)) {
                this.messager.receive(socket, io, Object.assign(data, {author: this.PM.connectedPlayer(socket)}));
            }
        }.bind(this));
    };






};


module.exports = new game();