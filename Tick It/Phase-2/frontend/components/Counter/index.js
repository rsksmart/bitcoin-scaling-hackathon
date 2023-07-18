import React from "react";

import styles from "./Counter.module.scss";

const Counter = ({ counter, setCounter }) => {
  return (
    <div className={styles.counterDiv}>
      <div
        className={styles.arrowLeft}
        onClick={() => {
          if (counter > 1) {
            setCounter(-1);
          }
        }}
      />
      <div className={styles.counter}>{counter}</div>
      <div
        className={styles.arrowRight}
        onClick={() => {
          setCounter(1);
        }}
      />
    </div>
  );
};

export default Counter;
