
var Connection = require('../dispatchers/lobby/connection');
var PlayerManager = require('../dispatchers/lobby/player-manager');
var Messager = require('../dispatchers/lobby/messager');

var Lobby = function() {

   // console.log(as.coolNumber, 'lobby');


    this.connection = new Connection();
    this.PM = new PlayerManager();
    this.messager = new Messager();

    this.runListeners = function(socket, io, session) {
        this.connection.onConnect(socket, io);

        socket.on('disconnect', function () {
            this.connection.onDisconnect(socket, io);
            this.PM.removePlayer(socket, io);
            session.removeSessionDataless(socket, io);
        }.bind(this));

        socket.on('add-player', function (name) {
            this.PM.addPlayer(socket, io, name);
        }.bind(this));

        socket.on('remove-player', function () {
            this.PM.removePlayer(socket, io);
        }.bind(this));

        socket.on('invite-player', function (data) {
            this.PM.invitePlayer(socket, io, data, session);
        }.bind(this));

        socket.on('accept-invite', function (data) {
            session.acceptInvite(socket, io, data);
            this.PM.unlockInviting(data);
        }.bind(this));

        socket.on('cancel-invite', function (data) {
            session.removeSession(io, data);
            this.PM.unlockInviting(data);
        }.bind(this));

        socket.on('leave-game', function () {
            session.removeSessionDataless(socket, io);
        }.bind(this));
        socket.on('handshake-back', function (data) {
            session.handshareBack(socket, io, data);
        }.bind(this));


        socket.on('send-message', function (data) {
            if (this.PM.inLobby(socket)) {
                this.messager.receive(socket, io, Object.assign(data, {author: this.PM.connectedPlayer(socket)}));
            }
        }.bind(this));


    };



};

module.exports = new Lobby();