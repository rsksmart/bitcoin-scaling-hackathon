import React, { useEffect, useState } from "react";

import styles from "./EventDate.module.scss";

const EventDate = ({ data, date, fontSize = "16px" }) => {
  const [day, setDay] = useState();
  const [time, setTime] = useState();

  useEffect(() => {
    const date = new Date(data);
    const formattedDay = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    });
    setDay(formattedDay);
    setTime(formattedTime);
  }, [data]);

  return (
    <>
      {day && time ? (
        <div style={{ fontSize: `${fontSize}` }} className={styles.eventDate}>
          {day} <span> | </span> {time}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default EventDate;
