// NoteContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const NoteContext = createContext();

export function NoteProvider({ children }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Load notes from storage when the app starts
    if (window.electronAPI) {
      window.electronAPI.getAllNotes().then(setNotes);
    }
  }, []);

  const saveNotes = async (updatedNotes) => {
    if (window.electronAPI) {
      await window.electronAPI.saveAllNotes(updatedNotes);
    }
    setNotes(updatedNotes);
  };

  const getSingleNote = (noteId) => {
    if (window.electronAPI) {
      return window.electronAPI.getNoteByIndex(noteId)
        .then(note => {
          return note;
        })
        .catch(error => {
          console.error('Error fetching note:', error);
        });
    } else {
      console.error("Error in context");
      return Promise.reject("Error in context");
    }
  };

  const updateNoteState = async (noteIndex, todoIndex) => {
    if (window.electronAPI) {
      const updatedNotes = [...notes];
      updatedNotes[noteIndex].to_do[todoIndex].completed =
        !updatedNotes[noteIndex].to_do[todoIndex].completed;

      try {
        await window.electronAPI.updateNote(noteIndex, updatedNotes[noteIndex]);
        setNotes(updatedNotes);
      } catch (error) {
        console.error("Error updating note:", error);
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

  return (
    <NoteContext.Provider
      value={{ notes, setNotes, saveNotes, updateNoteState, getSingleNote, handleDeleteNote }}
    >
      {children}
    </NoteContext.Provider>
  );
}

export function useNotes() {
  return useContext(NoteContext);
}
