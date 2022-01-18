import { useState, useEffect } from "react";
import axios from "axios";

const url = `https://language-trainer-project.herokuapp.com/vocabulary`;

/**
 * Returns the study page.
 */
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
