import React, { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { useAuth } from "../../../auth/useAuth";
import { useEthereum } from "@cryptogate/react-providers";
import { usePause } from "../../../hooks/use721";
import Image from "next/image";

import ConnectWallet from "../../../components/connect-wallet";
import ReportModal from "../../../components/ReportModal";
import EventDate from "../../../components/EventDate";
import EventLocation from "../../../components/EventLocation";
import EventDetails from "../../../components/EventDetails";
import Tickets from "../../../components/Tickets";
import TickitButton from "../../../components/tickitButton";
import TickitTag from "../../../components/TickitTag";
import EditEventModal from "../../../components/EditEventModal";
import AddExtraTicketModal from "../../../components/AddExtraTicketModal";

import { getEvents } from "../../../axios/event.axios";
import { getEventTicketType } from "../../../axios/eventTicketType.axios";

import styles from "./Event.module.scss";

const Event = () => {
  // States
  const [editEventModal, setEditEventModal] = useState(false);
  const [contractAddress, setContractAddress] = useState();
  const [eventData, setEventData] = useState();
  const [isOwner, setIsOwner] = useState(false);
  const [eventTickets, setEventTickets] = useState([]);
  const [refetchEvent, setRefetchEvent] = useState(null);
  const [ended, setEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportModal, setReportModal] = useState(false);

  // Hooks
  const router = useRouter();
  const { slug } = router.query;
  const { user } = useAuth();
  const { account } = useEthereum();
  const {
    pauseEvent,
    pauseState,
    pauseEventEvent,
    resetPause,
    unpauseEvent,
    unpauseState,
    unpauseEventEvent,
    resetUnpause,
    paused,
  } = usePause({
    contractAddress,
    refetchEvent,
  });

  // Functions
  // Gets the event details with the category and organization included
  const getEvent = async () => {
    await getEvents(
      JSON.stringify({
        relations: ["organization", "category"],
        where: { slug: slug },
      })
    ).then((data) => {
      setEventData(data?.data[0]);
      setContractAddress(data?.data[0]?.contractAddress);
      getTickets(data?.data[0].id);
    });
    // setRefetchEvent(Date.now());
  };

  // Gets the tickets related to event
  const getTickets = async (eventId) => {
    getEventTicketType(
      JSON.stringify({
        where: { eventId: eventId },
      })
    ).then((data) => {
      setEventTickets(data.data);
    });
  };

  const handleChangeState = async () => {
    if (paused.response == "true") {
      unpauseEvent([], {
        gasPrice: Number(process.env.NEXT_PUBLIC_GAS_PRICE),
        gasLimit: Number(process.env.NEXT_PUBLIC_GAS_LIMIT),
      });
    } else {
      pauseEvent([], {
        gasPrice: Number(process.env.NEXT_PUBLIC_GAS_PRICE),
        gasLimit: Number(process.env.NEXT_PUBLIC_GAS_LIMIT),
      });
    }
  };

  // Use Effects
  useEffect(() => {
    if (slug) {
      getEvent();
    }
  }, [slug, refetchEvent]);

  useEffect(() => {
    if (eventData) {
      let currentDate = new Date();
      if (new Date(eventData.eventDate) < currentDate) {
        setEnded(true);
      }
    }
    if (eventData && user) {
      let userId = user.id;
      let eventUserId = eventData.organization.ownerId;
      if (userId === eventUserId) {
        setIsOwner(true);
      }
    }
  }, [eventData || user || refetchEvent]);

  useEffect(() => {
    if (
      pauseState.status == "PendingSignature" ||
      unpauseState.status == "Mining" ||
      unpauseState.status == "PendingSignature" ||
      pauseState.status == "Mining"
    ) {
      setLoading(true);
    }
    if (pauseState.status == "Success" || unpauseState.status == "Success") {
      // waitResponse();
      setLoading(false);
    }
  }, [pauseState || unpauseState]);

  return (
    <div className={styles.eventWrapper}>
      {editEventModal && (
        <EditEventModal
          setEditEventModal={setEditEventModal}
          symbol={eventData.symbol}
          id={eventData.id}
          isPublished={eventData.isPublished}
          eventDetails={eventData}
          setRefetchEvent={setRefetchEvent}
        />
      )}
      {reportModal && (
        <ReportModal
          id={eventData.id}
          setReportModal={setReportModal}
          reportEvent
        />
      )}
      {eventData && (
        <div>
          <div
            style={{
              backgroundImage: `url(${eventData.banner})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "calc(65vh - 70px)",
            }}
          >
            <div
              style={{
                height: "100%",
                background:
                  " linear-gradient(0deg,rgba(15,10,10, 1) 0%, rgba(15,10,10, 0.55) 25%, rgba(255, 204, 0, 0.31) 65%,rgba(255, 204, 0, 0.11) 100%)",
              }}
            />
          </div>
          <Container
            style={{
              marginTop: "-50px",
            }}
          >
            <Row>
              <Col lg={6}>
                <div className={styles.titleDiv}>
                  <p className="pageTitle">{eventData.name}</p>
                  {!isOwner && user && (
                    <div
                      onClick={() => {
                        setReportModal(true);
                      }}
                      className={styles.reportDiv}
                    >
                      <Image
                        width={80}
                        height={25}
                        alt="report"
                        src="/images/repportText.svg"
                      />
                    </div>
                  )}
                  {isOwner && account && (
                    <div style={{ marginLeft: "20px" }}>
                      <Image
                        width={24}
                        height={24}
                        alt="edit"
                        src="/images/edit.png"
                        onClick={() => {
                          setEditEventModal(true);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  )}
                </div>
              </Col>
              <Col lg={6}>
                {!ended && (
                  <div className={styles.titleButtons}>
                    {isOwner && (
                      <ConnectWallet
                        active={
                          <TickitButton style2 text="connect wallet to edit" />
                        }
                        connected={<></>}
                      />
                    )}
                    {/* Reserve and View Activity button */}
                    {/* <TickitButton disabled text="RESERVE" />
                  <TickitButton text="VIEW ACTIVITY" /> */}
                  </div>
                )}
              </Col>
              {!ended && (
                <>
                  {isOwner && account && (
                    <Row style={{ marginTop: "32px" }}>
                      <div className={styles.buttons}>
                        <TickitButton
                          text={
                            paused.response == true
                              ? "RESUME SALES"
                              : "PAUSE SALE"
                          }
                          isLoading={loading}
                          disabled={loading}
                          onClick={() => {
                            handleChangeState();
                          }}
                        />
                        {/* <div style={{ marginLeft: "40px" }}>
                      <TickitButton style2 text="VIEW ACTIVITY" />
                      </div> */}
                      </div>
                    </Row>
                  )}
                </>
              )}
              <div
                style={{
                  marginTop: "32px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <EventDate data={eventData.eventDate} />
                <div style={{ marginLeft: "32px", display: "flex" }}>
                  <TickitTag disabled text={eventData.category.name} />
                </div>
              </div>

              <div style={{ marginTop: "14px" }}>
                <EventLocation location={eventData.location} fontSize="24px" />
              </div>
              <div style={{ marginTop: "14px" }}>
                <EventDetails width="60%" details={eventData.description} />
              </div>
            </Row>
            <Row
              style={{
                padding: "80px 0px",
              }}
            >
              <Tickets
                tickets={eventTickets}
                contractAddress={eventData.contractAddress}
                isOwner={account && isOwner}
                setRefetchEvent={setRefetchEvent}
                ended={ended}
              />
            </Row>
          </Container>
        </div>
      )}
    </div>
  );
};

export default Event;
