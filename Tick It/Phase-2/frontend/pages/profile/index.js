import React from "react";
import { Container, Row } from "react-bootstrap";

import UserProfileDetails from "../../components/UserProfileDetails";
import EventCard from "../../components/EventCard";

import styles from "./Profile.module.scss";

const Event = () => {
  return (
    <div className={styles.profileWrapper}>
      <UserProfileDetails />
      <Container style={{ paddingTop: "48px", paddingBottom: "48px" }}>
        <Row>
          <p className="section-title">Upcoming Events</p>
        </Row>
        <Row style={{ marginTop: "24px" }}>
          {[0, 1, 2]?.map((event, index) => (
            <EventCard key={index} />
          ))}
        </Row>
        <Row style={{ marginTop: "48px" }}>
          <p className="section-title">Past Events</p>
        </Row>
        <Row style={{ paddingTop: "24px", paddingBottom: "24px" }}>
          {[0, 1, 2]?.map((event, index) => (
            <EventCard key={index} />
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Event;
