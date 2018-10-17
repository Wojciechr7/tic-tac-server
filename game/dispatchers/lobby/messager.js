
var Messager = function() {


    this.receive = function(socket, io, data) {
        io.emit('update-messages', {
           msg: data.msg,
           author: data.author.name
        });
    }

};

module.exports = Messager;