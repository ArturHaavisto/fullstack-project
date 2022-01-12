import { useState, useEffect } from "react";
import axios from "axios";

const url = "http://localhost:8080/vocabulary";


const StudyPage = () => {
  const [vocabularyList, setVocabularyList] = useState([]);

  useEffect(() => {
    axios.get(url).then(({ data }) => setVocabularyList(data));
  }, []);

  return (
    <div>
      <ul>
        {vocabularyList.map((object, index) => (
          <li key={index}>
            {index + 1}. {object.english} = {object.finnish}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudyPage;
