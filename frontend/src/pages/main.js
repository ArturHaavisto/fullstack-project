import { useState } from "react";
import axios from "axios";
import "../styles/main.css";
import DangerousIcon from "@mui/icons-material/Dangerous";
import CheckIcon from "@mui/icons-material/Check";

const url = "http://localhost:8080/vocabulary";

const MainPage = () => {
  const [vocabularyList, setVocabularyList] = useState([]);
  const [guessLanguage, setGuessLanguage] = useState("To Finnish");
  const [result, setResult] = useState("");
  const [iconDiv, setIconDiv] = useState("hiddenIcons");
  const [isDisabled, setIsDisabled] = useState(false);

  const getVocabularyList = async () => {
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

  const setExercise = () => {
    guessLanguage === "To Finnish"
      ? setGuessLanguage("To English")
      : setGuessLanguage("To Finnish");
  };

  const changeInput = (index, input) => {
    let newList = [...vocabularyList];
    let item = { ...newList[index] };
    item.input = input;
    newList[index] = item;
    setVocabularyList(newList);
  };

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
