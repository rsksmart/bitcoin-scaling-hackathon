import React from "react";

import styles from "./TicketCounter.module.scss";

const TicketCounter = ({ sold, total }) => {
  return (
    <>
      {sold && total ? (
        <h4 className={styles.ticketCounter}>
          Sold {sold}/{total}
        </h4>
      ) : (
        <></>
      )}
    </>
  );
};

export default TicketCounter;
