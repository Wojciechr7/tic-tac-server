
var Messager = function () {

    this.send = function (socket, io, session, msg) {
        var sender = this.findSenderSession(socket, session.items);
        var message = {
            author: this.findAuthor(socket, session.items),
            content: msg
        };

        io.to(sender.from.socket).to(sender.to.socket).emit('pm-update', message);
    };


    this.findSenderSession = function (socket, sessions) {
        return sessions.find(function(session) {
            return session.from.socket === socket.id || session.to.socket === socket.id;
        });
    };

    this.findAuthor = function (socket, sessions) {
        var author = '';

        sessions.forEach(function(session) {
            if (session.from.socket === socket.id) {
                author = session.from.name;
                return;
            }
            if (session.to.socket === socket.id) {
                author = session.to.name;
                return;
            }
        });
        return author;
    };



};

module.exports = Messager;