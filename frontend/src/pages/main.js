import { useState } from "react";
import axios from "axios";
import "../styles/main.css";
import DangerousIcon from "@mui/icons-material/Dangerous";
import CheckIcon from "@mui/icons-material/Check";

const url = `https://language-trainer-project.herokuapp.com/vocabulary`;

/**
 * This page is for exercising vocabulary from English to Finnish and vice versa.
 * 
 * @returns A main page view.
 */
const MainPage = () => {
  /* A list that contains vocabulary. */
  const [vocabularyList, setVocabularyList] = useState([]);
  /* The indication on which is the guessing language. */
  const [guessLanguage, setGuessLanguage] = useState("To Finnish");
  /* The result of the exercise. */
  const [result, setResult] = useState("");
  /* Classname for the icon indicating correct and incorrect answers. */
  const [iconDiv, setIconDiv] = useState("hiddenIcons");
  /* A state of inputs and end-button. */
  const [isDisabled, setIsDisabled] = useState(false);

  /**
   * Gets the vocabulary from the backend.
   * Sets the vocabularyList according the guessLanguage.
   * Sets the result, iconDiv and isDisabled to the default values.
   */
  const getVocabularyList = async () => {
    console.log(url);
    console.log("joteain");
    const result = await axios.get(url);
    const list = result.data;
    let newList = [];
    for (let object of list) {
      if (guessLanguage === "To Finnish") {
        newList.push({
          word: object.english,
          guess: object.finnish,
          input: "",
          icon: getIcon(false)
        });
      } else {
        newList.push({
          word: object.finnish,
          guess: object.english,
          input: "",
          icon: getIcon(false)
        });
      }
    }
    setVocabularyList(newList);
    setResult("");
    setIconDiv("hiddenIcons");
    setIsDisabled(false);
  };

  /**
   * Switches the guessLanguage.
   */
  const setExercise = () => {
    guessLanguage === "To Finnish"
      ? setGuessLanguage("To English")
      : setGuessLanguage("To Finnish");
  };

  /**
   * Changes the input value inside vocabularyList.
   * 
   * @param {*} index - Index of the item in vocabularyList.
   * @param {*} input - Changed input value.
   */
  const changeInput = (index, input) => {
    let newList = [...vocabularyList];
    let item = { ...newList[index] };
    item.input = input;
    newList[index] = item;
    setVocabularyList(newList);
  };

  /**
   * Compares input and guess values in vocabularyList and calculates the correct amount.
   * The correct icon is set to each item to indicate correctness or incorrectness.
   * All input fields and end-button are disabled.
   * The result is shown.
   */
  const calculateResult = () => {
    let newList = [];
    let result = 0;
    for (let object of vocabularyList) {
      let newObject = {word: object.word, guess: object.guess, input: object.input, icon: object.icon}
      if (object.guess.toLowerCase() === object.input.toLowerCase()) {
        newObject.icon = getIcon(true);
        result++;
      }
      newList.push(newObject);
    }
    setVocabularyList(newList);
    setIconDiv("iconDiv");
    setIsDisabled(true);
    setResult(`${result} / ${vocabularyList.length}`);
  };

  /**
   * Returns corresponsible icon to the given parameter.
   * 
   * @param {boolean} isCorrect - Indicator on whether the answer was correct or not.
   */
  const getIcon = (isCorrect) => {
    if (isCorrect) {
      return <CheckIcon style={{ fill: "green" }} />;
    } else {
      return <DangerousIcon style={{ fill: "red" }} />;
    }
  };

  return (
    <div>
      <button onClick={setExercise}>{guessLanguage}</button>
      <button onClick={getVocabularyList}>Start</button>
      <ul className="examList">
        {vocabularyList.map((object, index) => (
          <li className="examListItem" key={index}>
            <div className="wordsDiv">
              <p>{object.word}</p>
              <input
                disabled = {isDisabled? "disabled" : ""}
                value={object.input}
                onChange={(e) => changeInput(index, e.target.value)}
              />
            </div>
            <div className={iconDiv}>{object.icon}</div>
          </li>
        ))}
      </ul>

      <button disabled={isDisabled} className="buttonResults" onClick={() => calculateResult()}>
        End
      </button>
      <p>{result}</p>
    </div>
  );
};

export default MainPage;
