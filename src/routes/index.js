const app = (module.exports = require("express")());
require("../database/connection");

app.use("/jmtapi/auth", require("./auth"));
app.use("/jmtapi/payment", require("./payment"));

// the catch all route
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "not found" });
});
