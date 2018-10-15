const Square = function(x, y) {
    this.x = x;
    this.y = y;
    this.sign = '';
    this.marked = false;

    this.mark = function(sign) {
        this.sign = sign;
    };

    this.unmark = function() {
        this.sign = '';
    }
};

module.exports = Square;