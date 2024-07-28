import React, { useEffect, useState, useCallback } from "react";
import styles from "./StickyNotes.module.scss";
import { Icon } from "@iconify/react/dist/iconify.js";
import CheckBox from "../CheckBox/CheckBox.js";
import { useNotes } from "../../Context/NoteContext.js";

const StickyNote = () => {
  const [note, setNote] = useState(null);
  const [noteId, setNoteId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("noteId") || localStorage.getItem("stickyNoteId") || null;
  });
  const [windowId, setWindowId] = useState(() => {
    return localStorage.getItem("stickyNoteWindowId") || null;
  });
  const { getSingleNote, handleDeleteNote } = useNotes();


  const fetchNote = useCallback(
    (id) => {
      if (id !== null && id !== undefined) {
        getSingleNote(id)
          .then((singleNote) => {
            console.log("Fetched note:", singleNote);
            setNote(singleNote);
          })
          .catch((error) => {
            console.error("Error fetching note:", error);
            setNote(null);
          });
      }
    },
    [getSingleNote]
  );

  useEffect(() => {
    const resizeWindow = () => {
      try {
        const container = document.querySelector(`.${styles.container}`);
        if (container) {
          const { width, height } = container.getBoundingClientRect();
          window.electronAPI.resizeStickyNote(
            Math.ceil(width),
            Math.ceil(height)
          );
        }
      } catch (error) {
        console.error("Error in resizeWindow:", error);
      }
    };

    setTimeout(resizeWindow, 100);

    const observer = new MutationObserver(() => {
      setTimeout(resizeWindow, 100);
    });
    const container = document.querySelector(`.${styles.container}`);
    if (container) {
      observer.observe(container, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [note, styles.container]);

  useEffect(() => {
    const handleSetContent = (newWindowId, newNoteId, content) => {
      console.log("Received note data:", newWindowId, newNoteId, content);
      setWindowId(newWindowId);
      setNoteId(newNoteId);
      localStorage.setItem("stickyNoteId", newNoteId);
      localStorage.setItem("stickyNoteWindowId", newWindowId);
      // Update URL without causing a page reload
      const url = new URL(window.location);
      url.searchParams.set("noteId", newNoteId);
      window.history.pushState({}, "", url);
    };

    window.electronAPI.onSetStickyNoteContent(handleSetContent);

    // If we have a noteId (from URL or localStorage), fetch the note
    if (noteId !== null && noteId !== undefined) {
      fetchNote(noteId);
    } else {
      // If we don't have a noteId, request it from the main process
      window.electronAPI.requestInitialNoteData();
    }
  }, [fetchNote, noteId]);

  const handleRefresh = () => {
    if (noteId !== null && noteId !== undefined) {
      fetchNote(noteId);
    } else {
      console.error("No noteId available for refresh");
    }
  };

  const handleClose = () => {
    if (windowId !== null && windowId !== undefined) {
      window.electronAPI.closeStickyNote(windowId);
    }
  };

  if (note === null) {
    return <div>Loading...</div>;
  }

  const handleDelete = () => {
    handleDeleteNote(noteId);
    handleClose();

  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.header}>
          <div className={styles.title}>{note.title}</div>
          <div className={styles.closeButton} onClick={handleClose}>
            <Icon icon="mdi:close" />
          </div>
        </div>
        <div className={styles.content}>
          {note.content}
          {note.to_do && note.to_do.length > 0 && (
            <div className={styles.todoList}>
              {note.to_do.map((item, index) => (
                <div key={index} className={styles.todoItem}>
                  <CheckBox
                    noteIndex={noteId}
                    todoIndex={index}
                    content={item}
                  />
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
            <Icon icon={"lucide:edit"} />
            <Icon icon={"wpf:delete"} onClick={handleDelete} />
            <Icon icon={"mdi:refresh"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyNote;
