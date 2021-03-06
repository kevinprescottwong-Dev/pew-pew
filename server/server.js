
const { SocketServerFactory } = require('./server-factory')
const { handleEnterLobby } = require('./socketHandlers/enterLobby')

const io = new SocketServerFactory().create();
const { initGame, gameLoop, getUpdatedVelocity } = require("./game");
const { FRAME_RATE } = require("./constants");
const { makeid } = require("./utils");

const state = {};
const clientRooms = {};

io.on("connection", (client) => {
    console.log("onConnection triggered...", { client_id: client.id });
    console.log("emitting playerConnected: ", client.id);

    console.log("io.sockets", io.sockets.sockets);
    client.emit("playerConnected", { playerId: client.id });

    client.on("keydown", handleKeydown);
    client.on("newGame", handleNewGame);
    client.on("joinGame", handleJoinGame);
    client.on("enterLobby", handleEnterLobby(client))
    client.on("disconnect", () => { console.log(`${client.id} disconnected`) })

    function handleJoinGame(roomName) {
        console.log("handleJoinGame...", { roomName });
        io.sockets.adapter.rooms.forEach((v, k, m) => console.log({ k, v, m }));

        console.log("has room?", io.sockets.adapter.rooms.has(roomName));
        const numClients = io.sockets.adapter.rooms.get(roomName).length;

        console.log({ numClients });

        if (numClients === 0) {
            client.emit("unknownCode");
            return;
        } else if (numClients > 1) {
            client.emit("tooManyPlayers");
            return;
        }

        clientRooms[client.id] = roomName;
        console.log("clientRooms", clientRooms);

        client.join(roomName);
        client.number = 2;
        client.emit("init", 2);

        startGameInterval(roomName);
    }

    function handleNewGame() {
        let roomName = makeid(5);
        console.log("created new room name:", roomName);

        clientRooms[client.id] = roomName;
        console.log("clientRooms:", Object.keys(clientRooms).join(","));
        client.emit("gameCode", roomName);

        state[roomName] = initGame();

        client.join(roomName);
        console.log("handleNewGame rooms", { rooms: io.sockets.adapter.rooms });
        client.number = 1;
        client.emit("init", 1);
    }

    function handleKeydown(keyCode) {
        const roomName = clientRooms[client.id];
        if (!roomName) {
            return;
        }
        try {
            keyCode = parseInt(keyCode);
        } catch (e) {
            console.error(e);
            return;
        }

        const vel = getUpdatedVelocity(keyCode);

        if (vel) {
            state[roomName].players[client.number - 1].vel = vel;
        }
    }
});

function startGameInterval(roomName) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(state[roomName]);

        if (!winner) {
            emitGameState(roomName, state[roomName]);
        } else {
            emitGameOver(roomName, winner);
            state[roomName] = null;
            clearInterval(intervalId);
        }
    }, 1000 / FRAME_RATE);
}

function emitGameState(room, gameState) {
    // Send this event to everyone in the room.
    io.sockets.in(room).emit("gameState", JSON.stringify(gameState));
}

function emitGameOver(room, winner) {
    io.sockets.in(room).emit("gameOver", JSON.stringify({ winner }));
}

io.listen(process.env.PORT || 3000);

module.exports = {
    io: io
}