import React, { useState, useEffect } from "react";
import { useNotes } from "../../Context/NoteContext.js";
import styles from "./homepage.module.scss";
import SearchBar from "../../components/SearchBar/SearchBar.js";
import Button from "../../components/Button/Button.js";
import Note from "../../components/Note/Note.js";
import Masonry from "react-responsive-masonry";
import Input from "../../components/Input/Input.js";

import { useSelector, useDispatch } from "react-redux";
import {fetchNots, saveNote, deleteNote} from "../../store/noteSlice.js"

function HomePage() {
  const { notes, setNotes } = useNotes(); // Use the context
  const [searchText, setSearchText] = useState("");
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [isEditButtonPressed, setIsEditButtonPressed] = useState(false);
  const [editNote, setEditNote] = useState({ id: "", content: "" });

  useEffect(() => {
    fetchNotes();
  }, []);
  // Add location to dependencies

  const fetchNotes = async () => {
    if (window.electronAPI) {
      const allNotes = await window.electronAPI.getAllNotes();
      setNotes(allNotes);
    } else {
      console.warn("electronAPI is not available");
      setNotes([]);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note &&
      note.title &&
      note.title.toLowerCase().includes((searchText || "").toLowerCase())
  );

  const handleAddNote = async ({ title, content, category }) => {
    if (!title || !content || !category) {
      console.error("Title, content, and category are required");
      return;
    }

    const lines = content.split("\n");
    const to_do = [];
    const processedContent = lines
      .map((line) => {
        if (line.startsWith("[ ] - ")) {
          to_do.push({ text: line.slice(6), completed: false });
          return null; // Remove this line from the main content
        }
        return line;
      })
      .filter(Boolean)
      .join("\n");

    const newNote = {
      title: String(title).trim(),
      content: processedContent.trim(),
      category: String(category).trim(),
      to_do: to_do,
    };

    if (window.electronAPI) {
      try {
        await window.electronAPI.saveNote(newNote);
        const updatedNotes = await window.electronAPI.getAllNotes();
        setNotes(updatedNotes);
      } catch (error) {
        console.error("Error saving note:", error);
      }
    } else {
      console.warn("electronAPI is not available");
    }
  };

  const handleEditNote = async ({ title, content, category }) => {
    if (!title || !content || !category) {
      console.error("Title, content, and category are required");
      return;
    }

    const lines = content.split("\n");
    const to_do = [];
    const processedContent = lines
      .map((line) => {
        if (line.startsWith("[ ] - ")) {
          to_do.push({ text: line.slice(6), completed: false });
          return null; // Remove this line from the main content
        }
        return line;
      })
      .filter(Boolean)
      .join("\n");

    const newNote = {
      title: String(title).trim(),
      content: processedContent.trim(),
      category: String(category).trim(),
      to_do: to_do,
    };

    if (window.electronAPI) {
      try {
        await window.electronAPI.updateNote(editNote.id, newNote);
        const updatedNotes = await window.electronAPI.getAllNotes();
        setNotes(updatedNotes);
      } catch (error) {
        console.error("Error saving note:", error);
      }
    } else {
      console.warn("electronAPI is not available");
    }
  };

  const handleDeleteNote = async (index) => {
    if (window.electronAPI) {
      const success = await window.electronAPI.deleteNote(index);
      if (success) {
        const updatedNotes = notes.filter((_, i) => i !== index);
        setNotes(updatedNotes);
      } else {
        console.error("Failed to delete note");
      }
    } else {
      console.warn("electronAPI is not available");
    }
  };

  const handleAddNoteButton = () => {
    setIsButtonPressed(!isButtonPressed);
  };

  const reverseNoteContent = (note) => {
    let reversedContent = note.content;

    // Add back the to-do items to the content
    if (note.to_do && note.to_do.length > 0) {
      const todoLines = note.to_do.map((item) => `[ ] - ${item.text}`);
      reversedContent = [...todoLines, "", reversedContent].join("\n");
    }

    return {
      ...note,
      content: reversedContent.trim(),
    };
  };

  return (
    <>
      {isButtonPressed && (
        <>
          <div className={styles.blurOverlay}></div>
          <div className={styles.inputWrapper}>
            <Input
              text={"New Note"}
              note={{ title: "", category: "", content: "" }}
              setIsButtonPressed={setIsButtonPressed}
              handleNoteButton={handleAddNote}
            />
          </div>
        </>
      )}

      {isEditButtonPressed && (
        <>
          <div className={styles.blurOverlay}></div>
          <div className={styles.inputWrapper}>
            <Input
              text={"Edit Note"}
              note={reverseNoteContent(editNote.content)}
              setIsButtonPressed={setIsEditButtonPressed}
              handleNoteButton={handleEditNote}
            />
          </div>
        </>
      )}
      <div className={styles.container}>
        <div className={styles.box}>
          <div className={styles.navItem}>
            <SearchBar
              id="search"
              type="search"
              placeholder="Search..."
              autoFocus
              required
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button
              icon={"gala:add"}
              text={"New Note"}
              className={styles.add_button}
              button={styles.button}
              onClick={handleAddNoteButton}
            />
          </div>

          <main>
            <Masonry columnsCount={3} gutter="20px">
              {filteredNotes.map((note, id) => (
                <Note
                  key={id}
                  noteId={id}
                  note={note}
                  className={styles.note}
                  handleDelete={() => handleDeleteNote(id)}
                  setIsEditButtonPressed={setIsEditButtonPressed}
                  setEditNote={setEditNote}
                />
              ))}
            </Masonry>
          </main>
        </div>
      </div>
    </>
  );
}

export default HomePage;
