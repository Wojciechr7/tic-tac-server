var Square= require('../square');

var Board = function () {


    this.runListeners = function (socket, io, session) {

        var mySession;

        socket.on('attack', function (square) {
            if (session.playerInSession(socket)) {
                mySession = session.findSessionBySocket(socket);
                var attacker = this.findAttacker(socket, io, mySession);

                if (attacker.socket === mySession.actualPlayer) {
                    this.markField(mySession, square, attacker);
                    this.switchPlayers(mySession);
                    if (this.winChecker(mySession.squares, square, attacker.sign)) {
                        mySession.squares = new Array(3).fill(0).map(function(v, i) { return new Array(3).fill(0).map(function(v, j) { return new Square(i, j)})});
                        io.to(mySession.to.socket).to(mySession.from.socket).emit('game-over', mySession);
                    } else {
                        io.to(mySession.to.socket).to(mySession.from.socket).emit('game-info', mySession);
                    }
                }
            }
        }.bind(this));


    };

    this.findAttacker = function (socket, io, session) {
        if (socket.id === session.from.socket) {
            return session.from;
        } else {
            return session.to;
        }
    };

    this.markField = function (mySession, square, attacker) {
        if (mySession.squares[square.x][square.y].sign === '') {
            mySession.squares[square.x][square.y].sign = attacker.sign;
            mySession.squares[square.x][square.y].marked = true;
        }
    };

    this.switchPlayers = function (session) {
        if (session.actualPlayer === session.to.socket) {
            session.actualPlayer = session.from.socket;
        } else {
            session.actualPlayer = session.to.socket;
        }
    };

    this.winChecker = function (squares, square, sign) {

        var n = squares[0].length;

        for (let i = 0; i < n; i++) {
            if (!squares[square.x][i].marked || squares[square.x][i].sign !== sign) {
                break;
            }
            if (i === n - 1) {
                // vertical
                return true;
            }
        }
        for (let i = 0; i < n; i++) {
            if (!squares[i][square.y].marked || squares[i][square.y].sign !== sign) {
                break;
            }
            if (i === n - 1) {
                // horizontal
                return true;
            }

        }

        if (square.x === square.y) {
            for (let i = 0; i < n; i++) {
                if (!squares[i][i].marked || squares[i][i].sign !== sign) {
                    break;
                }
                if (i === n - 1) {
                    // diagonal
                    return true;
                }
            }
        }

        if (square.x + square.y === n - 1) {
            for (let i = 0; i < n; i++) {
                if (!squares[i][(n - 1) - i].marked || squares[i][(n - 1) - i].sign !== sign) {
                    break;
                }
                if (i === n - 1) {
                    // anti-diagonal
                    return true;
                }
            }
        }
        return false;
    }


};

module.exports = new Board();