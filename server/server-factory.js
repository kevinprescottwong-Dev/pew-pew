const http = require('http');
const sio = require('socket.io');

function createSocketServer() {
    const httpServer = http.createServer();

    const io = new sio.Server(httpServer, {
        cors: {
            origin: process.env.SOCKET_IO_SERVER_ORIGINS || '*',
            credentials: true
        }
    });
    io.on
    return io;
}
class SocketServerFactory {
    // Creates an instance of
    create() {
        return createSocketServer();
    }
}

module.exports = {
    SocketServerFactory
}