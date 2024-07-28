import React from "react";

import styles from "./button.module.scss";
import { Icon } from "@iconify/react/dist/iconify.js";

function Button({icon, className, button, text, onClick}) {
  return (
    <div className={`${styles.container} ${className}`} onClick={onClick}>
      <Icon icon={icon}/>
      <div className={`${button}`} >{text}</div>
    </div>
  );
}

export default Button;
