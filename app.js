const path = require("path");
const express = require("express");

let Port = process.env.PORT || 8000;
const app = express();

//static directory
app.use(express.static(path.join(__dirname, "public")));

app.listen(Port, () => {
  console.log("Server Started");
});
