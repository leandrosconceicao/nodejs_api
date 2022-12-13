import io from './server.js';

io.on('connection', socket => {
    console.log('Socket conectado', socket.id);
    let branch = '';
    socket.on("select_branch", (data) => {
        branch = data;
        socket.join(data);
    })

    socket.on("message", data => {
        socket.to(branch).emit("message", data);
    });
    

    socket.on("close", () => {
        socket.disconnect();
    })


    socket.on("disconnect", (reason) => {
        console.log(reason);
    })
})