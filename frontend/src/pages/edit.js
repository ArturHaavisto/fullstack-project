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
  const [editId, setEditId] = useState(0);
  const [popupFunction, setPopupFunction] = useState();
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
   * Sends modified version of vocabulary item to the backend.
   */
  const modifyItem = () => {
    console.log("modify");
  };

  /**
   * Handles and checks that the modification is valid.
   */
  const handleModification = (id) => {
    setEditId(id);
    console.log("handle modification");
  };

  /**
   * Handles the adding of item to the backend.
   */
  const handleAdding = async (english, finnish) => {
    hideErrors();
    const words = { english: english, finnish: finnish };
    try {
      const response = await axios.post(url, words);
      if (response.status === 201) {
        let newVocabularyList = [
          ...vocabularyList,
          {
            id: response.insertId,
            english: words.english,
            finnish: words.finnish,
          },
        ];
        setVocabularyList(newVocabularyList);
        cancelEditView();
      }
    } catch (err) {
      const errObj = err.response.data;
      console.log(errObj);
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
  };

  /**
   * Deletes item.
   *  @param {*} id Id of the deleted item.
   */
  const deleteItem = (id) => {
    console.log("delete " + id);
  };

  /**
   * Shows edit view as a pop up.
   */
  const openEditView = (f, english, finnish, id) => {
    setPopupFunction(f);
    setInputEnglish(english);
    setInputFinnish(finnish);
    setEditId(id);
    changePopupView(true);
  };

  const cancelEditView = () => {
    hideErrors();
    changePopupView(false);
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
      <button onClick={() => openEditView(() => handleAdding, "", "")}>
        Add new{" "}
      </button>
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
              handleModification={handleModification}
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
              onClick={() => popupFunction(inputEnglish, inputFinnish)}
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
