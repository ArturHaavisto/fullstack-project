const mysql = require("mysql");
require("dotenv").config();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
});

/*
vocabulary table is structured as followed: id, english VARCHAR(255), finnish VARCHAR(255)
*/

let connectionFunctions = {
  close: () =>
    new Promise((resolve, reject) =>
      pool.end((err) => (err ? reject(err) : resolve("Connection closed!")))
    ),
  getAll: () =>
    new Promise((resolve, reject) => {
      pool.query("SELECT * FROM vocabulary", (err, vocabulary) => {
        err ? reject(err) : resolve(vocabulary);
      });
    }),
  save: (words) =>
    new Promise((resolve, reject) => {
      pool.query("INSERT INTO vocabulary SET ?", words, (err, response) => {
        err ? reject(err) : resolve(response);
      });
    }),
  deleteById: (id) =>
    new Promise((resolve, reject) => {
      let sql = "DELETE FROM vocabulary WHERE id = " + pool.escape(id);
      pool.query(sql, (err, response) => {
        err ? reject(err) : resolve(response);
      });
    }),
};

module.exports = connectionFunctions;
