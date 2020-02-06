const app = (module.exports = require("express")());
require("../database/connection");

app.use("/api/auth", require("./auth"));
app.use("/api/payment", require("./payment"));

// the catch all route
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "not found" });
});
