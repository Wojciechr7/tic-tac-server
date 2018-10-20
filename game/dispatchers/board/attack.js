var WinChecker = require('./win-checker');
var Square= require('../../square');


var Attack = function () {

    this.winChecker = new WinChecker();
    this.mySession = {};

    this.exec = function (ap) {
        if (ap.session.playerInSession(ap.socket)) {
            this.mySession = ap.session.findSessionBySocket(ap.socket);
            var attacker = this.findAttacker(ap.socket, ap.io, this.mySession);

            if (attacker.socket === this.mySession.actualPlayer.socket && this.fieldIsEmpty(this.mySession, ap.square)) {
                this.markField(this.mySession, ap.square, attacker);
                this.switchPlayers(this.mySession);
                if (this.winChecker.check(this.mySession.squares, ap.square, attacker.sign)) {
                    this.resetSquares();
                    this.sendSocket(ap.io, 'game-over');
                } else if(this.isDraw(this.mySession)) {
                    this.resetSquares();
                    this.sendSocket(ap.io, 'tie');
                } else {
                    this.sendSocket(ap.io, 'game-info');
                }
            }
        }
    };

    this.isDraw = function (session) {
        return !session.squares.some(function (row) {
            return row.some(function (square) {
                return square.sign === '';
            })
        })
    };

    this.sendSocket = function (io, msg) {
        io.to(this.mySession.to.socket).to(this.mySession.from.socket).emit(msg, this.mySession);
    };

    this.resetSquares = function () {
        this.mySession.squares = new Array(3).fill(0).map(function(v, i) { return new Array(3).fill(0).map(function(v, j) { return new Square(i, j)})});
    };

    this.findAttacker = function (socket, io, session) {
        if (socket.id === session.from.socket) {
            return session.from;
        } else {
            return session.to;
        }
    };

    this.fieldIsEmpty = function (mySession, square) {
        return mySession.squares[square.x][square.y].sign === '';
    };

    this.markField = function (mySession, square, attacker) {
        if (mySession.squares[square.x][square.y].sign === '') {
            mySession.squares[square.x][square.y].sign = attacker.sign;
            mySession.squares[square.x][square.y].marked = true;
        }
    };

    this.switchPlayers = function (session) {
        if (session.actualPlayer.socket === session.to.socket) {
            session.actualPlayer = session.from;
        } else {
            session.actualPlayer = session.to;
        }
    };
};

module.exports = Attack;