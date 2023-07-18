import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";

import { useAuth } from "../../../auth/useAuth";
import { useAuthModalContext } from "../../../context/AuthModalProvider";
import { getOrganization } from "../../../axios/organization.axios";

import EventDetails from "../../../components/EventDetails";
import TickitButton from "../../../components/tickitButton";
import Loader from "../../../components/loader/loader";

import styles from "../Vetting.module.scss";

const Applications = () => {
  const [organization, setOrganization] = useState();
  const [loading, setLoading] = useState(true);

  const { setModalOpen } = useAuthModalContext();
  const { user } = useAuth();
  const router = useRouter();

  const handleRouting = async () => {
    if (user) {
      getOrganizationDetails(user.id);
    } else {
      setModalOpen(true);
      let userDetails = await user;
      if (userDetails) {
        getOrganizationDetails(userDetails.id);
      }
    }
  };

  const getOrganizationDetails = async (id) => {
    let tempOrg = await getOrganization(
      JSON.stringify({
        where: { ownerId: id },
      })
    );
    setOrganization(tempOrg.data);
    if (tempOrg?.data.length) {
      if (tempOrg?.data?.length == 1) {
        if (tempOrg.data[0].isVetted) {
          router.push({
            pathname: "/create-event",
            query: { orgId: tempOrg.data[0].id },
          });
        } else {
          router.push("/vetting/applications");
        }
      }
    } else {
      router.push("/vetting");
    }
    setLoading(false);
  };

  useEffect(() => {
    handleRouting();
  }, [user]);

  return (
    <div className={styles.wrapper}>
      <Container style={{ padding: "50px 10px" }}>
        <Row style={{ paddingTop: "36px " }}>
          <Col md={6}>
            <p className="pageTitle">Applications</p>
          </Col>
          <Col md={6}>
            <div className={styles.buttons}>
              <TickitButton
                style2
                text="BACK TO HOME"
                minWidth="250px"
                onClick={() => {
                  router.push("/");
                }}
              />
            </div>
          </Col>
        </Row>
        {!loading ? (
          <>
            {organization?.map((organization, index) => (
              <div style={{ marginTop: "36px" }} key={index}>
                <div className="cardWrapper">
                  <div className={styles.appCard}>
                    <div>
                      <p className="section-title ">
                        organization name: {organization.name}
                      </p>
                      <p className="section-title ">
                        Status:{" "}
                        {organization.isVetted ? "Approved" : "Under Review"}
                      </p>
                    </div>

                    <div className={styles.event}>
                      {!organization.isVetted && (
                        <EventDetails details="Check your inbox for the approval email. Meanwhile, you can buy tickets for the best events in your region." />
                      )}
                    </div>
                    <div className={styles.appButton}>
                      <TickitButton
                        text={
                          organization.isVetted
                            ? "Create Event"
                            : "SEE APPLICATION"
                        }
                        minWidth="250px"
                        onClick={() => {
                          if (organization.isVetted) {
                            router.push({
                              pathname: "/create-event",
                              query: { orgId: organization.id },
                            });
                          } else {
                            router.push({
                              pathname: "/see-application",
                              query: { orgId: organization.id },
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div
            style={{
              height: "80vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader />
          </div>
        )}
      </Container>
    </div>
  );
};

export default Applications;
