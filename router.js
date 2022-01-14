const express = require("express");
var router = express.Router();
const connection = require("./crudrepository");
const Validator = require("jsonschema").Validator;
const validator = new Validator();

/* Schema for english and finnish words. */
const postSchema = {
  type: "string",
  pattern: "^[a-zäöå\\s]*$",
  minLength: 1,
  maxLength: 100,
};

/**
 * Validates the given word pair object.
 * 
 * @param {*} words - Data to be validated ({english: english word, finnish: finnish word}).
 * @returns Returns either trimmed, lower cased and validated words back in the same way that recieved or
 * returns errror messages as {msg: "errors", english: english error message, finnish: finnish error message}.
 */
function validatePost(words) {
  let english = words.english.trim().toLowerCase();
  let finnish = words.finnish.trim().toLowerCase();
  let validationEnglish = validator.validate(english, postSchema);
  let validationFinnish = validator.validate(finnish, postSchema);
  const englishErrors = validationEnglish.errors.length;
  const finnishErrors = validationFinnish.errors.length;
  if (englishErrors > 0 || finnishErrors > 0) {
    let englishErrorMessage = "";
    let finnishErrorMessage = "";
    if (englishErrors > 0) {
      englishErrorMessage = getErrorCode(validationEnglish.errors[0].name);
    }
    if (finnishErrors > 0) {
      finnishErrorMessage = getErrorCode(validationFinnish.errors[0].name);
    }

    return {
      msg: "errors",
      english: englishErrorMessage,
      finnish: finnishErrorMessage,
    };
  } else {
    const newWords = { english: english, finnish: finnish };
    return newWords;
  }
}

/**
 * Returns an error message according to given parameter.
 * 
 * @param {string} error - Type of error.
 * @returns Error message.
 */
function getErrorCode(error) {
  if (error === undefined) {
    return "";
  } else if (error === "type" || error === "pattern") {
    return "Invalid syntax! Use only letters and spaces.";
  } else if (error === "minLength" || error === "maxLength") {
    return "Invalid syntax! The length must be between 1 and 100.";
  } else {
    return "Invalid syntax!";
  }
}

/**
 * Routers a get-all-data-request to crudrepository and returns either the data or an error.
 */
router.get("/", async (req, res) => {
  try {
    let vocabulary = await connection.getAll();
    res.send(vocabulary);
  } catch (err) {
    res.status(400).send(err);
  }
});

/**
 * Routers a post data to the crudrepository.
 * Given data is validated before posting and if it fails, responses as an error.
 * If an error occurs after data is posted, the error is checked if it is a 
 * duplication error and response error is send according to that.
 * 
 * If post is a success, response is 
 * {words: {english: validated english word, finnish: validated finnish word}, id: item id}
 */
router.post("/", async (req, res) => {
  let words = req.body;
  const result = validatePost(words);
  if ("msg" in result) {
    res.status(400).send(result);
  } else {
    try {
      let response = await connection.save(result);
      res.status(201).send({words: result, id: response.insertId});
    } catch (err) {
      if (err.errno === 1062) {
        let errObj = { english: "Duplicate value!", finnish: "" };
        if (err.sqlMessage.includes("finnish")) {
          errObj.english = "";
          errObj.finnish = "Duplicate value!";
        }
        res.status(400).send(errObj);
      } else {
        res.status(500).send(err);
      }
    }
  }
});

/**
 * Routers a delete request by id to crudrepository.
 * If an error does not occur, the response is checked if an item has been deleted 
 * or not and according to that either responses as an 'ok' or as error.
 */
router.delete("/:id([0-9]+)", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await connection.deleteById(id);
    if (result.affectedRows > 0) {
      res.status(204).send({ msg: "Item deleted." });
    } else {
      res.status(400).send({ msg: "Item already deleted or not found." });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

/**
 * Routers a put request to crudrepository.
 * Given data is validated before sending and if it fails, responses as an error.
 * If an error occurs after data is sent, the error is checked if it is a 
 * duplication error and response error is send according to that.
 * 
 * If the update is a success, response is 
 * {words: {english: validated english word, finnish: validated finnish word}, id: item id}
 */
router.put("/:id([0-9]+)", async (req, res) => {
  const id = req.params.id;
  const words = req.body;
  const result = validatePost(words);
  if ("msg" in result) {
    res.status(400).send(result);
  } else {
    try {
      const response = await connection.editById(id, result);
      res.status(200).send({ words: result, id: id });
    } catch (err) {
      if (err.errno === 1062) {
        let errObj = { english: "Duplicate value!", finnish: "" };
        if (err.sqlMessage.includes("finnish")) {
          errObj.english = "";
          errObj.finnish = "Duplicate value!";
        }
        res.status(400).send(errObj);
      } else {
        res.status(500).send(err);
      }
    }
  }
});

module.exports = router;
