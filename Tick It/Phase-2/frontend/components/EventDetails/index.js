import React from "react";

import styles from "./EventDetails.module.scss";

const EventDetails = ({ width = "100%", details, fontSize = "16px" }) => {
  return (
    <>
      {details ? (
        <div
          style={{ fontSize: `${fontSize}`, width: `${width}` }}
          className={styles.eventDetails}
        >
          {details}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default EventDetails;
