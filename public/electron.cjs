// public/electron.cjs
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = process.env.ELECTRON_IS_DEV === "1";
const WindowManager = require("electron-window-manager");

let noteManager;

async function initializeNoteManager() {
  const NoteManagerModule = await import("../src/Services/NoteManager.mjs");
  const NoteManager = NoteManagerModule.default;
  noteManager = new NoteManager();
}

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  const startUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(startUrl);

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }

  return mainWindow;
}

function createStickyNoteWindow(noteId, x, y) {
  const stickyNote = new BrowserWindow({
    width: 300,
    height: 200,
    x: x,
    y: y,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    resizable:false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  //stickyNote.loadFile('index.html')

  const stickyNoteUrl = isDev
    ? `http://localhost:3000/sticky-note?noteId=${noteId}`
    : `file://${path.join(
        __dirname,
        "../build/index.html"
      )}#/sticky-note?noteId=${noteId}`;

  stickyNote.loadURL(stickyNoteUrl);

  stickyNote.webContents.on("did-finish-load", () => {
    console.log(`Sending noteId: ${noteId} to sticky note window`);
    stickyNote.webContents.send(
      "set-sticky-note-content",
      stickyNote.id,
      noteId,
      null
    );
    
    // Add this: Resize the window after content is loaded
    stickyNote.webContents.executeJavaScript(`
      try {
        const contentHeight = document.body.scrollHeight;
        const contentWidth = document.body.scrollWidth;
        window.electronAPI.resizeStickyNote(contentWidth, contentHeight);
      } catch (error) {
        console.error('Error in executeJavaScript:', error);
      }
    `).catch(error => {
      console.error('Failed to execute JavaScript in renderer:', error);
    });
  });

  if (isDev) {
    stickyNote.webContents.openDevTools({ mode: "detach" });
  }

  return stickyNote;
}

app.whenReady().then(async () => {
  await initializeNoteManager();
  const mainWindow = createMainWindow();

  // Setup IPC handlers
  ipcMain.handle("getAllNotes", () => {
    return noteManager.getAllNotes();
  });

  ipcMain.handle("saveNote", (event, note) => {
    return noteManager.saveNote(note);
  });

  ipcMain.handle("updateNote", (event, index, updatedNote) => {
    return noteManager.updateNote(index, updatedNote);
  });

  ipcMain.handle("deleteNote", (event, index) => {
    return noteManager.deleteNote(index);
  });

  ipcMain.handle("getNoteByIndex", (event, index) => {
    return noteManager.getNoteByIndex(index);
  });

  ipcMain.handle("saveAllNotes", async (event, notes) => {
    return noteManager.saveAllNotes(notes);
  });

  ipcMain.handle(
    "updateNoteState",
    (event, noteIndex, checkBoxIndex, state) => {
      return noteManager.updateNoteState(noteIndex, checkBoxIndex, state);
    }
  );

  // New IPC handlers for sticky notes
  ipcMain.handle("create-sticky-note", (event, noteId, content, x, y) => {
    const stickyNote = createStickyNoteWindow(x, y);
    stickyNote.webContents.on("did-finish-load", () => {
      stickyNote.webContents.send(
        "set-sticky-note-content",
        stickyNote.id,
        noteId,
        content
      );
    });
    return stickyNote.id;
  });

  ipcMain.handle("close-sticky-note", (event, windowId) => {
    const window = BrowserWindow.fromId(windowId);
    if (window) {
      window.close();
      return true;
    }
    return false;
  });

  ipcMain.handle("request-initial-note-data", (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    const noteId = win.getNoteId(); // You'll need to implement this method
    win.webContents.send("set-sticky-note-content", win.id, noteId, null);
  });

  ipcMain.on('resize-sticky-note', (event, size) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      win.setSize(size.width, size.height); // Add some padding
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

app.on("browser-window-created", function (e, window) {
  window.setMenu(null);
});
