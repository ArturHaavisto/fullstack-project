import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

import "../styles/EditListItem.css";

/**
 * Returns a structure to be inside a list item.
 */
export const EditListItem = ({
  id, // Id of the vocabularyList item.
  english, // English word of the vocabularyList item.
  finnish, // Finnish word of the vocabularyList item.
  openEditView, // A function that opens a popup edit view.
  deleteItem, // A function that deletes an item.
}) => {
  return (
    <div className="editListItemDiv">
      <div className="editListItemFirst">
        <EditIcon onClick={() => openEditView(() => english, finnish, id)} />
      </div>
      <div className="editListItemTexts">
        <p>{english}</p>
        <p>{finnish}</p>
      </div>
      <div className="editListItemLast">
        <DeleteIcon onClick={() => deleteItem(id)} />
      </div>
    </div>
  );
};
