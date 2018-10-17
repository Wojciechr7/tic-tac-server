
var Square= require('../../square');

var Session = function() {

    this.items = [];

    this.removeSessionDataless = function (socket, io) {
        var openSession = this.items.filter(function (session) {
            return session.from !== undefined && (socket.id === session.from.socket || socket.id === session.to.socket);
        });
        if (openSession[0]) {
            var opponentsId = socket.id === openSession[0].from.socket ? openSession[0].to.socket : openSession[0].from.socket;
            io.to(opponentsId).emit('close-game', {});
        }

        if (this.items.length) {
            this.items = this.items.filter(function(session) {
                return session.from !== undefined && socket.id !== session.from.socket && socket.id !== session.to.socket;
            });
        } else {
            this.items = [];
        }
        io.emit('update-sessions', {sessions: this.items});
    };


    this.findSessionById = function(id) {
        return this.items.find(function(session) {
            return id === session.id;
        });
    };

    this.findSessionBySocket = function (socket) {
        return this.items.find(function(session) {
            return socket.id === session.from.socket || socket.id === session.to.socket;
        });
    };

    this.removeSession = function(io, data) {
        this.items = this.items.filter(function(session) {
            return data.id !== session.id;
        });
        io.emit('update-sessions', {sessions: this.items});
    };

    this.acceptInvite = function(socket, io, data) {
        io.emit('update-sessions', {sessions: this.items});
        io.to(data.to.socket).to(data.from.socket).emit('handshake', data);

    };

    this.playerInSession = function(socket) {
        if (this.items.length) {
            return this.items.some(function(session) {
                return socket.id === session.from.socket || socket.id === session.to.socket;
            });
        }
        return false;
    };

    this.opponentInSession = function(name) {
        if (this.items.length) {
            return this.items.some(function(session) {
                return session.from.name === name || session.to.name === name;
            });
        }
        return false;
    };

    this.newSession = function(battle, id) {
        return Object.assign(battle, {
            id: id,
            squares: new Array(3).fill(0).map(function(v, i) { return new Array(3).fill(0).map(function(v, j) { return new Square(i, j)})}),
            result: {from: 0, to: 0},
            status: false,
            actualPlayer: battle.to.socket
        })
    };

    this.handshareBack = function(socket, io, data) {
        io.to(data.to.socket).emit('actual-data', data);
    }
};



module.exports = Session;