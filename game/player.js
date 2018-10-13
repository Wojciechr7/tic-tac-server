const Player = function(name, id, socket = '') {
    this.id = id;
    this.name = name;
    this.socket = socket;
};

module.exports = Player;