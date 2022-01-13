import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

import "../styles/EditListItem.css";

export const EditListItem = ({
  id,
  english,
  finnish,
  openEditView,
  deleteItem,
  handleModification,
}) => {
  return (
    <div className="editListItemDiv">
      <div className="editListItemFirst">
        <EditIcon onClick={() => openEditView(() => handleModification, english, finnish, id)} />
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
