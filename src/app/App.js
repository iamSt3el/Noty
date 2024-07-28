// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import MainWindow from "../components/MainWindow/MainWindow.js";
import HomePage from "../pages/HomePage/HomePage.js";
import Settings from "../pages/Settings/Settings.js";
import { NoteProvider } from '../Context/NoteContext.js'; // Import the NoteProvider
import StickyNote from "../components/StickyNotes/StickyNotes.js"

function App() {
  const navigate = useNavigate();


  return (
    <NoteProvider> {/* Wrap the Routes with NoteProvider */}
      <Routes>
        <Route element={<MainWindow />}>
          <Route path="/settings" element={<Settings/>}/>
          <Route path="/" element={<HomePage/>}/>
        </Route>
        <Route path="/sticky-note" element={<StickyNote/>}/>
      </Routes>
    </NoteProvider>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;