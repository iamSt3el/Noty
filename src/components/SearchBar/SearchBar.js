import React from "react";
import styles from "./searchBar.module.scss";
import { Search } from "lucide-react";

function SearchBar({ id, type, placeholder, value, onChange }) {
  return (
    <div className={styles.container}>
      <Search size={35} />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default SearchBar;
