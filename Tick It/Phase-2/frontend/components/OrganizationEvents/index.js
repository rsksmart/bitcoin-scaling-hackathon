import React from "react";
import { Container, Row } from "react-bootstrap";
import Image from "next/image";

import UpcomingEventsCard from "../UpcomingEventsCard";

import styles from "./OrganizationEvents.module.scss";

const OrganizationEvents = () => {
  return (
    <Container fluid className={styles.allEvents}>
      <div className={styles.title}>
        <p className="pageTitle">All Events</p>
        <div className={styles.userName}>
          <p className={styles.userTitle}>Factory People</p>
          <Image
            width={13}
            height={8}
            alt="search"
            src="/images/downArrow.png"
            className={styles.arrowDown}
          />
        </div>
      </div>
      <Row>
        <div className={styles.header}>
          <p className={styles.sectionTitle}>Upcoming Events</p>
        </div>
        {[0, 1, 2]?.map((event, index) => (
          <UpcomingEventsCard key={index} columns={4} />
        ))}
      </Row>
      <Row style={{ padding: "20px 0px" }}>
        <div className={styles.header}>
          <p className={styles.sectionTitle}>Ended</p>
        </div>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8]?.map((event, index) => (
          <UpcomingEventsCard key={index} columns={4} />
        ))}
      </Row>
    </Container>
  );
};
export default OrganizationEvents;
