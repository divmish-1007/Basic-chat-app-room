import { WebSocketServer, WebSocket } from "ws";
const wss = new WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (msg) => {
        // @ts-ignore
        const parsedMessage = JSON.parse(msg);
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type === "chat") {
            const currentRoom = allSockets.find((x) => x.socket == socket)?.room;
            // The above 1 line code is equal to the below 4 line of code
            // let currentRoom = null
            // for(let i=0; i<allSockets.length; i++){
            //     if(allSockets[i]?.socket == socket){
            //         currentRoom = allSockets[i]?.room
            //     }
            // }
            allSockets.forEach((soc) => {
                if (soc.room == currentRoom) {
                    soc.socket.send(parsedMessage.payload.message);
                }
            });
        }
    });
});
