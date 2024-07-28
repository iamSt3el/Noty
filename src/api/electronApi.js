export const getAllNotes = () => window.electronAPI.getAllNotes();
export const saveNote = (note) => window.electronAPI.saveNote(note);
export const updateNote = (id, updates) => window.electronAPI.updateNote(id, updates);
export const deleteNote = (id) => window.electronAPI.deleteNote(id);