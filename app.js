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

var clientCount = 0; // count of users online

// render index ejs page
app.get("/", (req, res) => {
    res.render("pages/index");
});

// connect event
io.sockets.on("connection", (socket) => {
    clientCount++;
    console.log("A user has connected. Total users: " + clientCount);

    // this section is broken rn.
    // TODO: Add button to allow tts to be said on users computer.
    socket.on("speak", (msg, user) => {
        say.speak(msg.substring(0, 200), "Alex", 1.0, (err) => {
            if (err) {
                console.error(err);
            }
            console.log(user + " said " + msg)
        });
    });
    
    // usercount event
    socket.on("update usercount", () => {
        io.sockets.emit("update usercount", clientCount);
    });

    // chat event
    socket.on("chat message", function(msg, user) {
        io.emit('chat message', user + ": " + msg);
    });

    // disconnect event
    socket.on("disconnect", () => {
        clientCount--;
        io.sockets.emit("update usercount", clientCount);
        console.log("A user has disconnected. Total users: " + clientCount);
    });
});

// start server
http.listen(3000, () => {
    console.log("Server started on port 3000")
});
