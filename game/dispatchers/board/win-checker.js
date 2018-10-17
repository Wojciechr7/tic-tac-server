
var WinChecker = function () {


    this.check = function (squares, square, sign) {
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

module.exports = WinChecker;