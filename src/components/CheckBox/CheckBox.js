import React, { useState } from "react";

import styles from "./CheckBox.module.scss";
import { useNotes } from "../../Context/NoteContext.js";

function CheckBox({ content, todoIndex, noteIndex }) {
  const [isChecked, setIsChecked] = useState(content.completed);
  const {updateNoteState} = useNotes();

  const handleChange = (ev) => {
    setIsChecked(ev.target.checked);
    updateNoteState(noteIndex, todoIndex)
  };
  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={isChecked}
        onChange={handleChange}
      />
      <p>{content.text}</p>
    </div>
  );
}

export default CheckBox;
