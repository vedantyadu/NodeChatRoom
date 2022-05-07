
const socketio = require("socket.io");
const express = require("express");
const path = require("path");


const app = express();

app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile("index.html");
});

app.listen(5500, () => {
    console.log("Listening at port 5500");
});


const io = socketio(5000);

let users = {};

io.on("connection", (socket) => {

    socket.on("join", (name) => {
        console.log(`${name} joined the chat`);
        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name);
    });

    socket.on("send", (message) => {
        console.log(`${users[socket.id]}: ${message}`);
        socket.broadcast.emit("new-message", {message: message, username: users[socket.id]});
    });

    socket.on("disconnect", () => {
        console.log(`${users[socket.id]} disconnected from the chat`);
        socket.broadcast.emit("user-disconnected", users[socket.id]);
        delete users[socket.id];
    });

});
