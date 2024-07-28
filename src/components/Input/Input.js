import React, { useState } from "react";
import styles from "./input.module.scss";
import Button from "../Button/Button.js";
import { useNavigate } from "react-router-dom";
function Input({ text, handleNoteButton, setIsButtonPressed, note }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(note.title);
  const [category, setCategory] = useState(note.category);
  const [content, setContent] = useState(note.content);

  const handleCancel = () => {
    navigate("/");
    setIsButtonPressed(false);
  };

  const handleAddButton = () => {
    handleNoteButton({ title, category, content });
    navigate("/");
    setIsButtonPressed(false);
  };

  const handleSaveButton = () => {
    handleNoteButton({title, category, content})
    navigate('/');
    setIsButtonPressed(false);
  }
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>{text}</h1>
        <div className={styles.title}>
          <input
            type="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title here...."
          />
        </div>
        <div className={styles.category}>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category here...."
          />
        </div>

        <div className={styles.content}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content here.."
          />
        </div>

        <div className={styles.option_buttons}>
          <Button
            text={"Cancel"}
            className={styles.cancel_button}
            button={styles.button}
            onClick={handleCancel}
          />

          {note === "" ? (
            <Button
              text={"Add Note"}
              className={styles.save_button}
              button={styles.button}
              onClick={handleAddButton}
            />
          ) : (
            <Button
              text={"Save Note"}
              className={styles.save_button}
              button={styles.button}
              onClick={handleSaveButton}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Input;
