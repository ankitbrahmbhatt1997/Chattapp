let socket = io();

socket.on("connect", function() {
  console.log("server connected");

  let paramsObject = new URL(window.location).searchParams;

  let params = {
    name: paramsObject.get("Name"),
    room: paramsObject.get("Room")
  };

  socket.emit("join", params, function(err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("No error");
    }
  });

  let message = document.querySelector("#message");
  let submit = document.querySelector(".sub");
  submit.addEventListener("click", function(e) {
    e.preventDefault();
    socket.emit(
      "createMessage",
      {
        from: "User",
        text: message.value
      },
      function(mess) {
        console.log(mess);
      }
    );
  });
});

socket.on("disconnect", function() {
  console.log("Server Disconnected");
});

socket.on("UsersList", function(users) {
  console.log(users);
});

socket.on("newMessage", function(message) {
  let list = document.querySelector("#messages");
  let formattedDate = moment(message.createdAt).format("hh:mm a");
  let list_item = document.createElement("li");
  list_item.classList.add("collection-item");
  list_item.classList.add("avatar");
  // let list_item_textNode = document.createTextNode(
  //   `${message.from} : ${formattedDate} ${message.text}`
  // );
  // list_item.appendChild(list_item_textNode);

  let source = document.getElementById("message-template").innerHTML;
  let template = Handlebars.compile(source);
  let context = {
    from: message.from,
    text: message.text,
    createdAt: formattedDate
  };
  let html = template(context);
  list_item.innerHTML = html;
  list.appendChild(list_item);

  xh = list.scrollHeight;

  list.scrollTo(0, xh);
});