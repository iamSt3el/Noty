import React from "react";
import styles from "./settings.module.scss";
import Button from "../../components/Button/Button.js";

function Settings() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.title}>Settings</div>
        <div className={styles.theme}>
          <p>Theme</p>
          <div className={styles.theme_buttons}>
            <Button
              icon={"ph:sun"}
              text={"Light"}
              className={styles.light_button}
              button={styles.button}
            />
            <Button
              icon={"ph:moon"}
              text={"Dark"}
              className={styles.dark_button}
              button={styles.button}
            />
          </div>
        </div>

        <div className={styles.default_color}>
          <p>Default Note Color</p>
          <div className={styles.color}></div>
        </div>

        <div className={styles.font_size}>
          <p>Font size</p>
          <select name="Fonts" id="Fonts">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra large">Extra Large</option>
          </select>
        </div>

        <div className={styles.default_view}>
          <p>Default View</p>
          <div className={styles.view_buttons}>
            <Button className={styles.grid_button}text={"Grid"} button={styles.button}/>
            <Button className={styles.list_button} text = {"List"} button={styles.button}/>
          </div>
        </div>

        <div className={styles.options}>
          <div className={styles.options_buttons}>
            <Button icon={"system-uicons:reset"} text={"Reset to Default"} className={styles.reset_button} button={styles.button}/>
            <Button icon={"lucide:save"} text={"Save Changes"} className={styles.save_button} button={styles.button}/>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
