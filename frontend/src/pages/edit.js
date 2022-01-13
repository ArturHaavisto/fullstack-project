import { useState, useEffect } from "react";
import axios from "axios";
import { EditListItem } from "../components/EditListItem";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";

import "../styles/edit.css";

const url = "http://localhost:8080/vocabulary";

const EditPage = () => {
  const [vocabularyList, setVocabularyList] = useState([]);
  const [inputEnglish, setInputEnglish] = useState("");
  const [inputFinnish, setInputFinnish] = useState("");
  const [editId, setEditId] = useState(-1);
  const [popupName, setPopupName] = useState("empty");
  const [errorNameEnglish, setErrorNameEnglish] = useState("hideErrorEnglish");
  const [errorNameFinnish, setErrorNameFinnish] = useState("hideErrorFinnish");
  const [errorEnglish, setErrorEnglish] = useState("");
  const [errorFinnish, setErrorFinnish] = useState("");

  /**
   * Gets vocabulary list from the databse when page is initialized.
   */
  useEffect(() => {
    axios.get(url).then(({ data }) => setVocabularyList(data));
  }, []);

  /**
   * Handles the sending of new and updated items to the backend.
   */
  const handleAdding = async (english, finnish) => {
    hideErrors();
    let func = axios.post;
    let currentUrl = url;
    if (editId > -1) {
      currentUrl = url + "/" + editId;
      func = axios.put;
    }
    const words = { english: english, finnish: finnish };
    try {
      const response = await func(currentUrl, words);
      let newVocabularyList = [];
      if (response.status === 201) {
        newVocabularyList = [
          ...vocabularyList,
          {
            id: response.data.id,
            english: response.data.words.english,
            finnish: response.data.words.finnish,
          },
        ];
      } else if (response.status === 200) {
        const id = Number(response.data.id);
        newVocabularyList = vocabularyList;
        let index = newVocabularyList.findIndex((obj) => obj.id === id);
        newVocabularyList[index].english = response.data.words.english;
        newVocabularyList[index].finnish = response.data.words.finnish;
      }
      setVocabularyList(newVocabularyList);
      cancelEditView();
    } catch (err) {
      if (err.response.status === 500) {
        console.log(err);
      } else {
        const errObj = err.response.data;
        let englishError = errObj.english;
        let finnishError = errObj.finnish;

        if (englishError !== "") {
          setErrorEnglish(englishError);
          showEnglishError();
        }
        if (finnishError !== "") {
          setErrorFinnish(finnishError);
          showFinnishError();
        }
      }
    }
  };

  /**
   * Deletes item.
   *  @param {*} id Id of the deleted item.
   */
  const deleteItem = async (id) => {
    try {
      const result = await axios.delete(url + "/" + id);
      if (result.status === 204) {
        const newVocabularyList = [...vocabularyList].filter(
          (object) => object.id !== id
        );
        setVocabularyList(newVocabularyList);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * Shows edit view as a pop up.
   */
  const openEditView = (english, finnish, id) => {
    setInputEnglish(english);
    setInputFinnish(finnish);
    setEditId(id);
    changePopupView(true);
  };

  const cancelEditView = () => {
    hideErrors();
    changePopupView(false);
    setEditId(-1);
  };

  const changePopupView = (showPopup) => {
    showPopup ? setPopupName("editPopupBackground") : setPopupName("empty");
  };

  const showEnglishError = () => {
    setErrorNameEnglish("showErrorEnglish");
  };

  const showFinnishError = () => {
    setErrorNameFinnish("showErrorFinnish");
  };

  const hideErrors = () => {
    setErrorNameEnglish("hideErrorEnglish");
    setErrorNameFinnish("hideErrorFinnish");
  };

  return (
    <div className="editPage">
      <button onClick={() => openEditView(() => "", "")}>Add new </button>
      <div className="editListTopBar">
        <div className="editListTopBarLeft">Edit</div>
        <div className="editListTopBarMiddle">
          <p>English</p>
          <p>Finnish</p>
        </div>

        <div className="editListTopBarRight">Delete</div>
      </div>
      <ul>
        {vocabularyList.map((object, index) => (
          <li key={index}>
            <EditListItem
              id={object.id}
              english={object.english}
              finnish={object.finnish}
              openEditView={openEditView}
              deleteItem={deleteItem}
            />
          </li>
        ))}
      </ul>
      <div className={popupName}>
        <div className="editPopup">
          <div className="editPopupCancel">
            <CancelIcon onClick={() => cancelEditView()} />
          </div>
          <div className="editPopupInputs">
            <input
              placeholder="English"
              value={inputEnglish}
              onChange={(e) => setInputEnglish(e.target.value)}
            />
            <input
              placeholder="Finnish"
              value={inputFinnish}
              onChange={(e) => setInputFinnish(e.target.value)}
            />
          </div>
          <div className="editPopupDone">
            <DoneIcon
              onClick={() => handleAdding(inputEnglish, inputFinnish)}
            />
          </div>
          <div className="inputErrors">
            <div className={errorNameEnglish}>
              <ErrorIcon style={{ fill: "red" }} />
              {errorEnglish}
            </div>
            <div className={errorNameFinnish}>
              <ErrorIcon style={{ fill: "red" }} />
              {errorFinnish}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
