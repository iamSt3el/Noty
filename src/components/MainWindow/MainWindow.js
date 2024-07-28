// src/components/MainWindow.js
import React from 'react';
import Sidebar from '../Sidebar/Sidebar.js';
import { Outlet } from 'react-router-dom';


function MainWindow() {
  return (
    <div>
      <Sidebar/>
      <Outlet/>
    </div>
  );
}

export default MainWindow;