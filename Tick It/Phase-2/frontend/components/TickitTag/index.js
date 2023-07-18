import React from "react";

import styles from "./TickitTag.module.scss";

const TickitTag = ({
  text,
  onClick,
  padding = "10px 20px",
  fontSize = "16px",
  minWidth = "130px",
  isSmall = false,
  disabled = false,
}) => {
  return (
    <>
      {text ? (
        <button
          className={styles.btn}
          onClick={onClick}
          disabled={disabled}
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = "var(--secondary-dark)")
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = "var(--secondary)")
          }
          style={{
            fontSize: fontSize,
            padding: isSmall ? "6px 20px " : padding,
            minWidth: minWidth,
            color: "var(--white)",
            backgroundColor: "var(--secondary)",
            cursor: disabled ? "default" : "pointer",
          }}
        >
          {text}
        </button>
      ) : (
        <></>
      )}
    </>
  );
};

export default TickitTag;
