import React from "react";

import styles from "./EventLocation.module.scss";

const EventLocation = ({ location, fontSize = "16px" }) => {
  return (
    <>
      {location ? (
        <div
          style={{ fontSize: `${fontSize}` }}
          className={styles.eventLocation}
        >
          {location}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default EventLocation;
