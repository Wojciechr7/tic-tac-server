const Player = function(name, id, socket = '') {
    this.id = id;
    this.name = name;
    this.socket = socket;
    this.inviting = false;
    this.sign = '';
};

module.exports = Player;