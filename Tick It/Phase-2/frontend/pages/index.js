import Slider from "../components/Slider";
import EventCard from "../components/EventCard";
import { Container, Row, Col } from "react-bootstrap";
import ExploreEvents from "../components/ExploreEvents";
import React, { useEffect, useState } from "react";
import { getEvents } from "../axios/event.axios";

export default function Home() {
  const [allEvents, setAllEvents] = useState();

  const Events = async () => {
    let events = await getEvents(
      JSON.stringify({
        relations: ["organization"],
        where: { isPublished: true },
      })
    );
    setAllEvents(events?.data);
  };

  useEffect(() => {
    Events();
  }, []);

  return (
    <main style={{ backgroundColor: " var(--background)" }}>
      <Slider events={allEvents} />
      <Container style={{ paddingBottom: "65px" }}>
        {allEvents && (
          <Col style={{ marginTop: "65px" }}>
            <p className="section-title">Hot Events</p>
            <Row
              style={{
                marginTop: "24px",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              {allEvents.slice(0, 4).map((event, index) => (
                <EventCard key={index} eventData={event} />
              ))}
            </Row>
          </Col>
        )}
        <Col id="explore" style={{ marginTop: "65px" }}>
          <ExploreEvents events={allEvents} />
        </Col>
      </Container>
    </main>
  );
}
