import React from "react";
import { Col } from "react-bootstrap";

import EventDate from "../EventDate";

import styles from "./UpcomingEventsCard.module.scss";

const UpcomingEventsCard = ({ ticket }) => {
  return (
    <>
      <Col md={3} sm={6} className={styles.cardWrapper}>
        <div
          style={{
            backgroundImage: `url(${ticket?.image})`,
          }}
          className={styles.cardImage}
        >
          <div className={styles.cardGradient}>
            <p className={styles.eventTitle}>{ticket?.name}</p>
            <EventDate data={ticket?.event?.eventDate} />
            <p className={styles.eventTime}>{ticket?.event?.name}</p>
          </div>
        </div>
      </Col>
    </>
  );
};

export default UpcomingEventsCard;
