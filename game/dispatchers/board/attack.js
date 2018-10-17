var WinChecker = require('./win-checker');
var Square= require('../../square');


var Attack = function () {

    this.winChecker = new WinChecker();
    this.mySession = {};

    this.exec = function (ap) {
        if (ap.session.playerInSession(ap.socket)) {
            this.mySession = ap.session.findSessionBySocket(ap.socket);
            var attacker = this.findAttacker(ap.socket, ap.io, this.mySession);

            if (attacker.socket === this.mySession.actualPlayer) {
                this.markField(this.mySession, ap.square, attacker);
                this.switchPlayers(this.mySession);
                if (this.winChecker.check(this.mySession.squares, ap.square, attacker.sign)) {
                    this.mySession.squares = new Array(3).fill(0).map(function(v, i) { return new Array(3).fill(0).map(function(v, j) { return new Square(i, j)})});
                    ap.io.to(this.mySession.to.socket).to(this.mySession.from.socket).emit('game-over', this.mySession);
                } else {
                    ap.io.to(this.mySession.to.socket).to(this.mySession.from.socket).emit('game-info', this.mySession);
                }
            }
        }
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
};

module.exports = Attack;