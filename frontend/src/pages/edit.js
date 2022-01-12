import { useState, useEffect } from "react";
import axios from "axios";
import { EditListItem } from "../components/EditListItem";

const url = "http://localhost:8080/vocabulary";

const EditPage = () => {
  const [vocabularyList, setVocabularyList] = useState([]);

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
   * Sends new item to the backend.
   */
  const addNewItem = () => {
    console.log("add new");
  };

  /**
   * Deletes item.
   */
  const deleteItem = (id) => {
    console.log("delete");
  };

  /**
   * Shows edit view as a pop up.
   */
  const openEditView = () => {
    console.log("open edit");
  };

  return (
    <div>
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
    </div>
  );
};

export default EditPage;
