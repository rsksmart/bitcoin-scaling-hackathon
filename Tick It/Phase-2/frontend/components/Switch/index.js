import React from "react";

import styles from "./Switch.module.scss";

const Switch = ({
  isOn,
  handleToggle,
  name,

  colorOne = "var(--primary-dark)",
  colorTwo = "transparent",
}) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className={styles.switchCheckbox}
        id={`switch` + name}
        type="checkbox"
      />
      <label
        style={{ background: isOn ? colorOne : colorTwo }}
        className={styles.switchLabel}
        htmlFor={`switch` + name}
      >
        <span className={styles.switchButton} />
      </label>
    </>
  );
};

export default Switch;
