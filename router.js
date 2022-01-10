const express = require("express");
var router = express.Router();
const connection = require("./crudrepository");

router.get("/", async (req, res) => {
  try {
    let vocabulary = await connection.getAll();
    res.send(vocabulary);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
