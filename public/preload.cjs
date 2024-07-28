// public/preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getAllNotes: () => ipcRenderer.invoke("getAllNotes"),
  saveNote: (note) => ipcRenderer.invoke("saveNote", note),
  getNoteByIndex: (index) => ipcRenderer.invoke("getNoteByIndex", index),
  updateNote: (index, updatedNote) =>
    ipcRenderer.invoke("updateNote", index, updatedNote),
  updateNoteState: (noteIndex, checkBoxIndex, state) =>
    ipcRenderer.invoke("updateNoteState", noteIndex, checkBoxIndex, state),
  deleteNote: (index) => ipcRenderer.invoke("deleteNote", index),
  moveWindow: (deltaX, deltaY) =>
    ipcRenderer.send("move-window", { deltaX, deltaY }),
  navigate: (path) => ipcRenderer.send("navigate", path),
  saveAllNotes: (notes) => ipcRenderer.invoke("saveAllNotes", notes),
  createStickyNote: (windowId, noteId, content, x, y) =>
    ipcRenderer.invoke("create-sticky-note", windowId, noteId, content, x, y),
  onSetStickyNoteContent: (callback) =>
    ipcRenderer.on(
      "set-sticky-note-content",
      (event, windowId, noteId, content) => callback(windowId, noteId, content)
    ),
  closeStickyNote: (windowId) =>
    ipcRenderer.invoke("close-sticky-note", windowId),
  requestInitialNoteData: () => ipcRenderer.invoke("request-initial-note-data"),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
  resizeStickyNote: (width, height) => ipcRenderer.send('resize-sticky-note', { width, height }),

});
