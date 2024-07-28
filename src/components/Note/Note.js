import React from "react";
import styles from "./note.module.scss";
import CheckBox from "../CheckBox/CheckBox.js";
import { Icon } from "@iconify/react/dist/iconify.js";

function Note({ noteId, note, className, handleDelete, setIsEditButtonPressed, setEditNote}) {
  const createStickyNote = async () => {
    const x = window.screenX + 100; // Offset from main window
    const y = window.screenY + 100;
    try {
      const windowId = await window.electronAPI.createStickyNote(noteId,note, x, y);
      console.log('Created sticky note with window ID:', windowId);
      // You can store this ID if you need to close the sticky note later
    } catch (error) {
      console.error('Error creating sticky note:', error);
    }
  };
  
  const closeStickyNote = async (windowName) => {
    try {
      await window.electronAPI.closeStickyNote(windowName);
      console.log('Closed sticky note:', windowName);
    } catch (error) {
      console.error('Error closing sticky note:', error);
    }
  };

  const handleEditButton = () => {
    setEditNote({id:noteId, content:note})
    setIsEditButtonPressed(true);

  }

  
  return (
    <div className={`${styles.container} ${className}`} onDoubleClick={createStickyNote}>
      <div className={styles.header}>
        <div className={styles.title}>{note.title}</div>
      </div>
      <div className={styles.content}>
        {note.content}
        {note.to_do && note.to_do.length > 0 && (
          <div className={styles.todoList}>
            {note.to_do.map((item, index) => (
              <div key={index} className={styles.todoItem}>
                <CheckBox noteIndex={noteId} todoIndex={index} content={item} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={styles.footer}>
        <div className={styles.category}>
          <div className={styles.oval}></div>
          {note.category}
        </div>
        <div className={styles.options}>
          <Icon icon={"lucide:edit"} onClick={handleEditButton}/>
          <Icon icon={"wpf:delete"} onClick={handleDelete} />
        </div>
      </div>
    </div>
  );
}

export default Note;
