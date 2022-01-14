import { useState, useEffect } from "react";
import axios from "axios";
import { EditListItem } from "../components/EditListItem";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";

import "../styles/edit.css";

const url = "http://localhost:8080/vocabulary";

/**
 * This page is used to add, edit and delete vocabulary items.
 * 
 * @returns The edit page view.
 */
const EditPage = () => {
  /* The list that contains vocabulary {id: item id, english: English word, finnish: Finnish word} */
  const [vocabularyList, setVocabularyList] = useState([]);
  /* Input value for English word. */
  const [inputEnglish, setInputEnglish] = useState("");
  /* Input value for Finnish word. */
  const [inputFinnish, setInputFinnish] = useState("");
  /* The id of the currently edited vocabulary item. */
  const [editId, setEditId] = useState(-1);
  /* Classname for the popup div. */
  const [popupName, setPopupName] = useState("empty");
  /* Classname for the English error div. */
  const [errorNameEnglish, setErrorNameEnglish] = useState("hideErrorEnglish");
  /* Classname for the Finnish error div. */
  const [errorNameFinnish, setErrorNameFinnish] = useState("hideErrorFinnish");
  /* Error message for English word input. */
  const [errorEnglish, setErrorEnglish] = useState("");
  /* Error message for Finnish word input. */
  const [errorFinnish, setErrorFinnish] = useState("");

  /**
   * Gets vocabulary list from the databse when page is initialized.
   */
  useEffect(() => {
    axios.get(url).then(({ data }) => setVocabularyList(data));
  }, []);

  /**
   * Handles the sending of new and updated items to the backend.
   * If the editId value is changed to indicate an index value, then this function
   * will send an update request. Otherwise it will send a post request.
   * If the request was valid and an ok status code is recieved, a new item is stored to 
   * vocabularyList or an old item is updated.
   * If the request recieves an error which is users fault, both input error messages are
   * updated according to the recieved error data.
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
          setErrorNameEnglish("showErrorEnglish");
        }
        if (finnishError !== "") {
          setErrorFinnish(finnishError);
          setErrorNameFinnish("showErrorFinnish");
        }
      }
    }
  };

  /**
   * Deletes the item with given id.
   * 
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
   * Sets the editing states and changes the popup-view visible.
   */
  const openEditView = (english, finnish, id) => {
    setInputEnglish(english);
    setInputFinnish(finnish);
    setEditId(id);
    changePopupView(true);
  };

  /**
   * Sets the editing states to default values.
   */
  const cancelEditView = () => {
    hideErrors();
    changePopupView(false);
    setEditId(-1);
  };

  /**
   * Shows or hides the popup-view, depends on the parameter.
   * 
   * @param {boolean} showPopup - Indicator on whether the popup-view is show or not.
   */
  const changePopupView = (showPopup) => {
    showPopup ? setPopupName("editPopupBackground") : setPopupName("empty");
  };

  /**
   * Hides the popup-view error messages.
   */
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
