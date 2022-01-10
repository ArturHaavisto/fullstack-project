const express = require("express");
const vocabulary = require("./router");
const connection = require("./crudrepository");
const app = express();
const port = 8080;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.static("frontend/build"));

app.use(express.json());
app.use("/vocabulary", vocabulary);

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
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
