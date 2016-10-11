// sockets.js
var socketio = require('socket.io')

module.exports.listen = function(app){
    io = socketio.listen(app)

    users = io.of('/users')
    users.on('connection', function(socket){
        // socket.on ...

        console.log('Conectado a socket.io')
    })

    return io
}