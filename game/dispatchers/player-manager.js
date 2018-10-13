var Player = require('../player.js');

var PlayerManager = function() {

    this.players = [];

    this.addPlayer = function(socket, io, name) {
        var playerFound = false;

        this.players.forEach(function (player) {
            if (!player.socket.indexOf(socket.id)) {
                playerFound = true;
            }
        });

        if (!playerFound && !this.nameConflict(name)) {
            if (!this.players.length) {
                this.players.push(new Player(name, 1, socket.id));
            } else {
                this.players.push(new Player(name, this.players[this.players.length - 1].id + 1, socket.id));
            }


            this.emitPlayers(io);
        }
    };

    this.removePlayer = function(socket, io) {
        this.players = this.players.filter(function(player) {
            return socket.id !== player.socket;
        });
        this.emitPlayers(io);

    };

    this.emitPlayers = function(io) {
        io.emit('players-update', {
            players: this.players.map(function (player) {
                return {
                    name: player.name,
                    id: player.id
                };
            })
        });
    };

    this.inLobby = function(socket) {
        return this.players.some(function(player) {
            return socket.id === player.socket;
        });
    };
    this.connectedPlayer = function(socket) {
        return this.players.find(function(player) {
            return socket.id === player.socket;
        });
    };

    this.nameConflict = function(name) {
        return this.players.some(function(player) {
            return name === player.name;
        });
    };

    this.findByName = function(name) {
        return this.players.find(function(player) {
            return name === player.name;
        });
    };

    this.invitePlayer = function (socket, io, data, sessions) {
        var battle = {
            from: Object.assign(this.connectedPlayer(socket), {sign: 'O'}),
            to: Object.assign(this.findByName(data.name), {sign: 'x'})
        };
        if (!sessions.length) {
            sessions.push(Object.assign(battle, {id: 1, squares: [], result: {from: 0, to: 0}, status: false}));
        } else {
            sessions.push(new Player(battle, {id: sessions[sessions.length - 1].id + 1, squares: [], result: {from: 0, to: 0}, status: false}));
        }
        if (battle.from.socket !== battle.to.socket) {
            io.to(battle.to.socket).emit('private-invite', battle);
        }
    };

};

module.exports = PlayerManager;