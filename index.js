const express = require("express");
const vocabulary = require("./router");
const connection = require("./crudrepository");
const app = express();
const port = process.env.PORT || 8080;

/* Makes sure that cors is allowed from all sources and necessary methods. */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

app.use(express.static("frontend/build"));

app.use(express.json());
app.use("/vocabulary", vocabulary);

const server = app.listen(port, () => {
  
});

const shutdown = () => {
  server.close(() => {
    connection.close(() => {
      process.exit(0);
    });
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

module.exports = port;
