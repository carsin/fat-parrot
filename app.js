const express = require("express");
const app = express();
app.set("view engine", "ejs");
const socketio = require("socket.io");
const http = require("http").Server(app);
const io = socketio(http);

var clientCount = 0;

app.get("/", (req, res) => {
    res.render("pages/index");
});

io.sockets.on("connection", (socket) => {
    clientCount++;
    console.log("A user has connected. Total users: " + clientCount);

    socket.on("chat message", (msg, user) => {
        io.sockets.emit("chat message", user + ": " + msg);
    });

    socket.on("update usercount", () => {
        io.sockets.emit("update usercount", clientCount);
    });

    socket.on("disconnect", () => {
        clientCount--;
        io.sockets.emit("update usercount", clientCount);
        console.log("A user has disconnected. Total users: " + clientCount);
    });
});

http.listen(3000, () => {
    console.log("Server started on port 3000")
});
