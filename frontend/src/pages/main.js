import { useState } from "react";
import axios from "axios";

const url = "http://localhost:8080/vocabulary";

const MainPage = () => {
  const [vocabularyList, setVocabularyList] = useState([]);
  const [guessLanguage, setGuessLanguage] = useState("finnish");
  const [result, setResult] = useState("");

  const getVocabularyList = async () => {
    const result = await axios.get(url);
    const list = result.data;
    let newList = [];
    for (let object of list) {
      if (guessLanguage === "finnish") {
        newList.push({
          word: object.english,
          guess: object.finnish,
          input: "",
        });
      } else {
        newList.push({
          word: object.finnish,
          guess: object.english,
          input: "",
        });
      }
    }
    setVocabularyList(newList);
    setResult("");
  };

  const setExercise = () => {
    guessLanguage === "finnish"
      ? setGuessLanguage("english")
      : setGuessLanguage("finnish");
  };

  const changeInput = (index, input) => {
    let newList = [...vocabularyList];
    let item = { ...newList[index] };
    item.input = input;
    newList[index] = item;
    setVocabularyList(newList);
  };

  const calculateResult = () => {
    let result = 0;
    for (let object of vocabularyList) {
      if (object.guess.toLowerCase() === object.input.toLowerCase()) {
        result++;
      }
    }
    setResult(`${result} / ${vocabularyList.length}`);
  };

  return (
    <div>
      <button onClick={setExercise}>{guessLanguage}</button>
      <button onClick={getVocabularyList}>Start</button>
      <ul>
        {vocabularyList.map((object, index) => (
          <li key={index}>
            {object.word}
            <input
              value={object.input}
              onChange={(e) => changeInput(index, e.target.value)}
            ></input>
          </li>
        ))}
      </ul>

      <button onClick={calculateResult}>End</button>
      <p>{result}</p>
    </div>
  );
};

export default MainPage;
