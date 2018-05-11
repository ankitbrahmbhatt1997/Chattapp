const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { generateMessage } = require("./utils/message");
const { isString } = require("./utils/Stringchecker");
const { Users } = require("./utils/users");
let users = new Users();

let Port = process.env.PORT || 8000;
const app = express();
let server = http.createServer(app);
let io = socketIO(server);
//static directory
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", socket => {
  console.log("new user added");

  socket.on("join", (params, callback) => {
    if (!isString(params.name) && !isString(params.room)) {
      return callback("Name and Room are required");
    }

    socket.join(params.room);

    socket.emit("newMessage", generateMessage("Admin", "Welcome"));

    socket.broadcast
      .to(params.room)
      .emit("newMessage", generateMessage("Admin", `${params.name} added`));
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit("UsersList", users.getUserList(params.room));
    callback();
  });

  socket.on("createMessage", (message, callback) => {
    let user = users.getUser(socket.id);
    if (user && isString(message.text)) {
      io
        .to(user.room)
        .emit("newMessage", generateMessage(user.name, message.text));
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected");
    let removedUser = users.removeUser(socket.id);

    io
      .to(removedUser.room)
      .emit("updatedUsersList", users.getUserList(removedUser.room));
    io
      .to(removedUser.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${removedUser.name} has left the group`)
      );
  });
});

server.listen(Port, () => {
  console.log("Server Started");
});
