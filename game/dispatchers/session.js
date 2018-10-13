

var Session = function() {

    this.items = [];

    this.removeSessionDataless = function (socket) {
        this.items = this.items.filter(function(session) {
            return socket.id !== session.from.socket && socket.id !== session.to.socket;
        });
    };

    this.findSessionById = function(id) {
        return this.items.find(function(session) {
            return id === session.id;
        });
    };

    this.removeSession = function(data) {
        this.items = this.items.filter(function(session) {
            return data.id !== session.id;
        });
    };

};



module.exports = Session;