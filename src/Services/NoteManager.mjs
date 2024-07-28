import Store from "electron-store";

class NoteManager {
  constructor() {
    this.store = new Store({
      name: "sticky-notes",
      fileExtension: "data",
    });
  }

  getAllNotes() {
    return this.store.get("notes", []);
  }

  saveNote(note) {
    const notes = this.getAllNotes();
    notes.push(note);
    this.store.set("notes", notes);
    return notes.length - 1; // Return the index of the new note
  }

  updateNote(index, updatedNote) {
    const notes = this.getAllNotes();
    if (index >= 0 && index < notes.length) {
      notes[index] = updatedNote;
      this.store.set("notes", notes);
      return true;
    }
    return false;
  }

  

  deleteNote(index) {
    const notes = this.getAllNotes();
    if (index >= 0 && index < notes.length) {
      notes.splice(index, 1);
      this.store.set("notes", notes);
      return true;
    }
    return false;
  }

  getNoteByIndex(index) {
    const notes = this.getAllNotes();
    if (index >= 0 && index < notes.length) {
      return notes[index];
    }
    return null;
  }

  // New function to save all notes
  saveAllNotes(notes) {
    if (Array.isArray(notes)) {
      this.store.set("notes", notes);
      return true;
    }
    return false;
  }
}

export default NoteManager;