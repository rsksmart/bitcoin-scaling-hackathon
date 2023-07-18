import React, { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import Link from "next/link";
import { useRouter } from "next/router";

import { useAuth } from "../../../auth/useAuth";
import { getOrganization } from "../../../axios/organization.axios";

import DashboardBar from "../../../components/DashboardBar";
import OrganizationCard from "../../../components/OrganizationCard";
import AddOrganizationCard from "../../../components/AddOrganizationCard";
import UpcomingEventsCard from "../../../components/UpcomingEventsCard";

import styles from "./Dashboard.module.scss";

const Dashboard = ({}) => {
  const [organizationData, setOrganizationData] = useState();
  const [tickets, setTickets] = useState([]);

  const { user } = useAuth();
  const router = useRouter();

  const getOrganizationDetails = async (id) => {
    let organization = await getOrganization(
      JSON.stringify({
        where: { ownerId: id },
      })
    );
    setOrganizationData(organization?.data);
  };

  useEffect(() => {
    if (user) {
      getOrganizationDetails(user?.id);
    } else {
      router.push("/");
    }
  }, [user]);

  useEffect(() => {
    let temp = localStorage.getItem("tickets");
    let tickets = JSON.parse(temp);
    setTickets(tickets);
  }, []);

  return (
    <Container fluid className="dashboardWrapper">
      <Row>
        <Col lg={2} style={{ padding: "0px" }}>
          <DashboardBar selected="dashboard" />
        </Col>

        <Col lg={10} style={{ paddingBottom: "48px" }}>
          <div className={styles.section}>
            <div className="cardWrapper">
              <div className={styles.sectionContent}>
                <p className="section-title">Organizations</p>
                <Row className={styles.organizations}>
                  {organizationData?.map((organization, index) => (
                    <OrganizationCard key={index} data={organization} />
                  ))}
                  <Col lg={3} md={6} className={styles.addOrganizations}>
                    <AddOrganizationCard />
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div className={styles.section} style={{ marginTop: "48px" }}>
            <div className="cardWrapper">
              <div className={styles.sectionContent}>
                <div className={styles.header}>
                  <p className="section-title">Upcoming Events</p>
                  {tickets && (
                    <Link href="/user/tickets" className={styles.viewAll}>
                      View All Tickets
                    </Link>
                  )}
                </div>
                {tickets ? (
                  <Row>
                    {tickets?.slice(0, 4).map((ticket, index) => (
                      <UpcomingEventsCard key={index} ticket={ticket} />
                    ))}
                  </Row>
                ) : (
                  <Row>
                    <Link href="/explore" className={styles.viewAll}>
                      Explore Upcoming Events To Buy Tickets
                    </Link>
                  </Row>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
