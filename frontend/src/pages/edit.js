import { useState, useEffect } from "react";
import axios from "axios";
import { EditListItem } from "../components/EditListItem";
import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";

import "../styles/edit.css";

const url = "http://localhost:8080/vocabulary";

const EditPage = () => {
  const [vocabularyList, setVocabularyList] = useState([]);
  const [inputEnglish, setInputEnglish] = useState("");
  const [inputFinnish, setInputFinnish] = useState("");
  const [popupFunction, setPopupFunction] = useState();
  const [popupName, setPopupName] = useState("empty");

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
  const handleModification = () => {
    console.log("handle modification");
  };

  /**
   * Sends new item to the backend.
   */
  const addNewItem = () => {
    console.log("add new");
  };

  /**
   * Handles the adding of item.
   */
  const handleAdding = () => {
    console.log("handles adding");
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
  const openEditView = (f, english, finnish) => {
    setPopupFunction(f);
    setInputEnglish(english);
    setInputFinnish(finnish);
    changePopupView(true);
    console.log("open edit");
  };

  const cancelEditView = () => {
    changePopupView(false);
  };

  const changePopupView = (showPopup) => {
    showPopup ? setPopupName("editPopupBackground") : setPopupName("empty");
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
            <DoneIcon onClick={() => popupFunction()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
