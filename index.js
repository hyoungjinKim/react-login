const express = require("express");
const app = express();
const port = 5000;
const mongoose = require("mongoose");
mongoose
  .connect(`mongodb+srv://Kim:1234@cluster0.gbmpnfx.mongodb.net/`)
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log("DB connection error: " + err));

app.listen(port, () => {
  console.log("Server running on port " + port);
});
