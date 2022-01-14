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
vocabulary table is structured as followed:

CREATE TABLE `vocabulary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `english` varchar(255) NOT NULL,
  `finnish` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `english` (`english`),
  UNIQUE KEY `finnish` (`finnish`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8

*/

/**
 * Functions that interact with the database.
 */
let connectionFunctions = {
  /**
   * Ends the pool connection to the database.
   */
  close: () =>
    new Promise((resolve, reject) =>
      pool.end((err) => (err ? reject(err) : resolve("Connection closed!")))
    ),

  /**
   * Gets all data from the database.
   */
  getAll: () =>
    new Promise((resolve, reject) => {
      pool.query("SELECT * FROM vocabulary", (err, vocabulary) => {
        err ? reject(err) : resolve(vocabulary);
      });
    }),

  /**
   * Saves data to the database.
   * 
   * @param {*} words - Data to be stored to the database ({english: english word, finnish: finnish word}).
   */
  save: (words) =>
    new Promise((resolve, reject) => {
      pool.query("INSERT INTO vocabulary SET ?", words, (err, response) => {
        err ? reject(err) : resolve(response);
      });
    }),

  /**
   * Deletes an item from the database.
   * 
   * @param {*} id - Id of the item to be deleted.
   */
  deleteById: (id) =>
    new Promise((resolve, reject) => {
      const sql = "DELETE FROM vocabulary WHERE id = " + pool.escape(id);
      pool.query(sql, (err, response) => {
        err ? reject(err) : resolve(response);
      });
    }),
    
  /**
   * Updates an item with given new data.
   * 
   * @param {*} id - Id of the updated item.
   * @param {*} words - Data to be updated to the database ({english: english word, finnish: finnish word}).
   */
  editById: (id, words) =>
    new Promise((resolve, reject) => {
      const data = [words.english, words.finnish, id];
      const sql = "UPDATE vocabulary SET english = ?, finnish = ? WHERE id = ?";
      pool.query(sql, data, (err, response) => {
        err ? reject(err) : resolve(response)
      })
    })
};

module.exports = connectionFunctions;
