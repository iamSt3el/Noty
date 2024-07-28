import React, { useState } from "react";
import { Home, FolderOpen, Settings } from "lucide-react";
import styles from "./sidebar.module.scss";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [activeItem, setActiveItem] = useState("Home");
  const navigate = useNavigate();

  const handleItemClick = (itemName, path) => {
    setActiveItem(itemName);
    navigate(path);
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo_name}>
        <h1>Nebula</h1>
      </div>
      <nav className={styles.navbar}>
        <div
          className={`${styles.navItem} ${
            activeItem === "Home" ? styles.active : ""
          }`}
          onClick={() => handleItemClick("Home", "/")}
        >
          <Home />
          <span>Home</span>
        </div>
        <div
          className={`${styles.navItem} ${
            activeItem === "Categories" ? styles.active : ""
          }`}
          onClick={() => handleItemClick("Categories", "#")}
        >
          <FolderOpen />
          <span>Categories</span>
        </div>
        <div
          className={`${styles.navItem} ${
            activeItem === "Settings" ? styles.active : ""
          }`}
          onClick={() => handleItemClick("Settings", "/settings")}
        >
          <Settings />
          <span>Settings</span>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
