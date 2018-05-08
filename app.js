const path = require("path");
const express = require("express");

let port = process.env.PORT || 8000;
const app = express();

//static directory
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
  console.log("Server Started");
});
