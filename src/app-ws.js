import {WebSocketServer} from "ws";

function onError(ws, err) {
    console.error(`onError: ${err.message}`);
}

function onMessage(ws, data) {
    console.log(`onMessage: ${data}`);
    ws.send(data);
}

function onConnection(ws, req) {
    console.log(ws);
    ws.on('message', data => onMessage(ws, data));
    ws.on('error', error => onError(ws, error));
    console.log(`onConnection`);
}

function appWs(server) {
    const wss = new WebSocketServer({
        server
    });

    wss.on('connection', onConnection);

    console.log(`App Web Socket Server is running!`);
    return wss;
}

export default appWs;