const express = require("express");
const app = express();
const socketio = require("socket.io");
const http = require("http").Server(app);
const io = socketio(http);

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
    console.log("A user has connected.");

    socket.on("chat message", function(msg, user) {
        io.emit('chat message', user + ": " + msg);
    });

    socket.on("disconnect", function() {
        console.log("A user has disconnected.");
    });
});

http.listen(3000, function() {
    console.log("Server started on port 3000")
});
