const express = require("express");
var router = express.Router();
const connection = require("./crudrepository");
const Validator = require("jsonschema").Validator;
const validator = new Validator();

const postSchemaEnglish = {
  type: "string",
  pattern: "^[a-z\\s]*$",
  minLength: 1,
  maxLength: 100,
};

const postSchemaFinnish = {
  type: "string",
  pattern: "^[a-z\\s]*$",
  minLength: 1,
  maxLength: 100,
};

function validatePost(words) {
  let english = words.english.trim().toLowerCase();
  let finnish = words.finnish.trim().toLowerCase();
  let validationEnglish = validator.validate(english, postSchemaEnglish);
  let validationFinnish = validator.validate(finnish, postSchemaFinnish);
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

router.get("/", async (req, res) => {
  try {
    let vocabulary = await connection.getAll();
    res.send(vocabulary);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/", async (req, res) => {
  let words = req.body;
  const result = validatePost(words);
  if ("msg" in result) {
    console.log(result);
    res.status(400).send(result);
  } else {
    try {
      let response = await connection.save(words);
      res.status(201).send(response);
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

router.delete("/:id([0-9]+)", async (req, res) => {
  let id = req.params.id;
  try {
    let result = await connection.deleteById(id);
    if (result.affectedRows > 0) {
      res.status(204).send({ msg: "Item deleted." });
    } else {
      res.status(400).send({ msg: "Item already deleted or not found." });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
