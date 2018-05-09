const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

let Port = process.env.PORT || 8000;
const app = express();
let server = http.createServer(app);
let io = socketIO(server);
//static directory
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", socket => {
  console.log("new user added");

  socket.emit("newMessage", {
    from: "Admin",
    text: "Welcome",
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit("newMessage", {
    from: "Admin",
    text: "new User joined",
    createdAt: new Date().getTime()
  });

  socket.on("createMessage", message => {
    io.emit("newMessage", {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on("disconnection", () => {
    console.log("User Disconnected");
  });
});

server.listen(Port, () => {
  console.log("Server Started");
});
