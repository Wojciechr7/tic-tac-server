
var Connection = function() {

    this.allClients = [];

    this.onConnect = function(socket, io) {
        this.allClients.push(socket);
        io.emit('online', {online : this.allClients.length});
    };

    this.onDisconnect = function(socket, io) {
        var i = this.allClients.indexOf(socket);
        this.allClients.splice(i, 1);
        io.emit('online', {online : this.allClients.length});
    };

};



module.exports = Connection;