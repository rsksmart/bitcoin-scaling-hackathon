import { Row, Col, Container } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { getEvents } from "../../../axios/event.axios";
import { getOrganization } from "../../../axios/organization.axios";
import { useAuth } from "../../../auth/useAuth";

import EventCard from "../../../components/EventCard";
import DashboardBar from "../../../components/DashboardBar";
import Loader from "../../../components/loader/loader";

import styles from "./hosting.module.scss";

const Hosting = () => {
  const [hostedEvents, setHostedEvents] = useState();
  const [organizationsData, setOrganizationsData] = useState();

  const { user } = useAuth();
  const router = useRouter();

  const getOrganizations = async (id) => {
    let organization = await getOrganization(
      JSON.stringify({
        where: { ownerId: id },
      })
    );
    setOrganizationsData(organization.data);
  };

  const getHosted = async () => {
    let events = await getEvents(
      JSON.stringify({
        relations: ["organization"],
        where: organizationsData?.map((organization) => ({
          organizationId: organization.id,
        })),
      })
    );
    setHostedEvents(events?.data);
  };

  useEffect(() => {
    if (organizationsData?.length > 0) {
      getHosted();
    }
  }, [organizationsData]);

  useEffect(() => {
    if (user?.id) {
      getOrganizations(user?.id);
    } else {
      router.push("/");
    }
  }, [user]);

  return (
    <Container fluid className="dashboardWrapper">
      <Row>
        <Col lg={2} style={{ padding: "0px" }}>
          <DashboardBar selected="hosting" />
        </Col>

        <Col lg={10} style={{ padding: "0px" }}>
          <Container fluid>
            <p
              className="pageTitle"
              style={{ marginBottom: "24px", marginTop: "24px" }}
            >
              Host
            </p>
            {hostedEvents?.length > 0 ? (
              <Row className={styles.hostCard}>
                {hostedEvents?.map((event, index) => (
                  <EventCard key={index} eventData={event} />
                ))}
              </Row>
            ) : (
              <Loader />
            )}
          </Container>
        </Col>
      </Row>
    </Container>
  );
};
export default Hosting;
