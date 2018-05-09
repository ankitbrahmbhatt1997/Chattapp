let socket = io();

socket.on("connect", function() {
  console.log("server connected");
});

socket.on("disconnect", function() {
  console.log("Server Disconnected");
});

socket.on("newMessage", function(message) {
  console.log("Got new message", message);
});
