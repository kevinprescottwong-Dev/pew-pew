const { SocketServerFactory } = require('../server-factory')
const io = new SocketServerFactory().create();


function handleEnterLobby(socket) {
    return () => {
        console.log("handleEnterLobby... ",)
        socket.join("lobby");
        console.log(socket.adapter.rooms)
    }


}

module.exports = { handleEnterLobby }