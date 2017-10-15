// TTS
const say = require("say");

// Express
const express = require("express");
const app = express();
app.set("view engine", "ejs");
const http = require("http").Server(app);

// Socket.io
const socketio = require("socket.io");
const io = socketio(http);

var clientCount = 0;

app.get("/", (req, res) => {
    res.render("pages/index");
});

io.sockets.on("connection", (socket) => {
    clientCount++;
    console.log("A user has connected. Total users: " + clientCount);

    socket.on("speak", (msg, user) => {
        say.speak(msg.substring(0, 200), "Alex", 1.0, (err) => {
            if (err) {
                console.error(err);
            }

            console.log(user + " said " + msg)
        });
        console.log(msg + " from " + user)
    });

    socket.on("update usercount", () => {
        io.sockets.emit("update usercount", clientCount);
    });

    socket.on("chat message", function(msg, user) {
        io.emit('chat message', user + ": " + msg);
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
