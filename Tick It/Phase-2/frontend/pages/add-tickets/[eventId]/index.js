import React, { useEffect, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import Image from "next/image";

import { useEthereum } from "@cryptogate/react-providers";

import { useAuth } from "../../../auth/useAuth";
import { useAuthModalContext } from "../../../context/AuthModalProvider";
import { useLaunchpad } from "../../../hooks/useLaunchpad";
import { getEvents, updateEvent } from "../../../axios/event.axios";
import { postEventTicketTypeBatch } from "../../../axios/eventTicketType.axios";

import ConnectWallet from "../../../components/connect-wallet";
import EventDate from "../../../components/EventDate";
import EventLocation from "../../../components/EventLocation";
import EventDetails from "../../../components/EventDetails";
import TickitButton from "../../../components/tickitButton";
import TickitTag from "../../../components/TickitTag";
import AddTicketModal from "../../../components/AddTicketModal";
import EditEventModal from "../../../components/EditEventModal";
import TicketCardPreview from "../../../components/TicketCardPreview";

import styles from "./addTickets.module.scss";

const AddTickets = () => {
  // Use States
  const [tickets, setTickets] = useState([]);

  // This is used for contract deployedment to get the ticket prices and ticket supply
  const [ticketPrices, setTicketPrices] = useState([]);
  const [ticketSupply, setTicketSupply] = useState([]);

  const [addTicketModal, setAddTicketModal] = useState(false);
  const [editEventModal, setEditEventModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [eventDetails, setEventDetails] = useState();
  const [update, setUpdate] = useState(false);

  // Hook Calls
  const router = useRouter();
  const { account } = useEthereum();
  const {
    createEvent,
    createEventState,
    createEventEvents,
    resetCreateEventState,
  } = useLaunchpad();
  const { user } = useAuth();
  const { setModalOpen } = useAuthModalContext();

  // Functions
  // Contract interaction to deploy event
  const deployEvent = async () => {
    createEvent(
      [
        eventDetails?.name,
        eventDetails?.symbol,
        "",
        ticketPrices,
        ticketSupply,
        [process.env.NEXT_PUBLIC_ADMIN_ADDRESS, account],
        [10, 90],
        account,
        10,
        "0x815ae514cff4150ec895809ae516283047f6dff8e679158b151a8495f70fc929",
      ],
      {
        gasPrice: Number(process.env.NEXT_PUBLIC_GAS_PRICE),
        gasLimit: Number(process.env.NEXT_PUBLIC_GAS_LIMIT),
      }
    );
  };

  // Api call to save contract
  const launchRes = async () => {
    updateEvent(
      {
        contractAddress: createEventEvents[0].args["_newClone"].toLowerCase(),
        isPublished: true,
        totalSupply: ticketSupply.reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0),
      },
      eventDetails.id
    ).then((data) => {
      let ticketsData = tickets.map((ticket, index) => {
        return {
          eventId: data.id,
          name: ticket.name,
          description: ticket.description,
          supply: ticket.supply,
          price: ticket.price * 10 ** 18,
          image: ticket.image,
          ticketTypeId: index,
        };
      });
      postEventTicketTypeBatch(ticketsData).then(() => {
        resetCreateEventState();
        router.push(`/event/${data.slug}`);
      });
    });
  };

  // Remove tickets before deployment
  const handleRemoveTicket = (ticketName) => {
    const tmpTickets = tickets.slice();

    const updatedTickets = tmpTickets.filter(
      (tkt) => tkt?.name?.toLowerCase() !== ticketName?.toLowerCase()
    );
    setTickets(updatedTickets);
  };

  useEffect(() => {
    if (
      createEventState.status == "PendingSignature" ||
      createEventState.status == "Mining"
    ) {
      setLoading(true);
      setDisabled(true);
    }
    if (createEventState.status == "Success") launchRes();
  }, [createEventState]);

  useEffect(() => {
    if (!user) {
      setModalOpen();
    } else {
      getEvents(JSON.stringify({ where: { id: router.query.eventId } })).then(
        (data) => {
          setEventDetails(data.data[0]);
        }
      );
      setModalOpen();
    }
  }, [user || update]);

  // This ticket sets the prices and the supply for the contract to deploy
  useEffect(() => {
    setTicketPrices(
      tickets.map((ticket) => {
        let price = ticket.price * 10 ** 18;
        return price;
      })
    );
    let supplyAccumulated = tickets.reduce((acc, ticket) => {
      let lastSupply = acc[acc.length - 1] || 0;
      let currentSupply = ticket.supply + lastSupply;
      acc.push(currentSupply);
      return acc;
    }, []);
    setTicketSupply(supplyAccumulated);
  }, [tickets]);

  return (
    <div className={styles.eventWrapper}>
      {addTicketModal && (
        <AddTicketModal
          setAddTicketModal={setAddTicketModal}
          setTickets={setTickets}
          tickets={tickets}
        />
      )}
      {editEventModal && (
        <EditEventModal
          setEditEventModal={setEditEventModal}
          symbol={eventDetails.symbol}
          id={eventDetails.id}
          isPublished={eventDetails.isPublished}
          setUpdate={setUpdate}
          eventDetails={eventDetails}
        />
      )}
      <div>
        <div
          style={{
            backgroundImage: `url(${eventDetails?.banner})`,
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
            <Col>
              <div className={styles.titleDiv}>
                <p className="pageTitle">{eventDetails?.name}</p>
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
              </div>
            </Col>

            <Row style={{ marginTop: "32px" }}>
              {tickets.length > 0 && (
                <div>
                  {account ? (
                    <TickitButton
                      text="LAUNCH EVENT"
                      isLoading={loading}
                      disabled={disabled}
                      onClick={async () => {
                        deployEvent();
                      }}
                    />
                  ) : (
                    <ConnectWallet
                      active={
                        <TickitButton text="connect wallet to launch" style2 />
                      }
                    />
                  )}
                </div>
              )}
            </Row>
            <div
              style={{
                marginTop: "32px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <EventDate data={eventDetails?.eventDate} />
              <div style={{ marginLeft: "32px", display: "flex" }}>
                <TickitTag disabled text={eventDetails?.category} />
              </div>
            </div>

            <div style={{ marginTop: "14px" }}>
              <EventLocation
                location={eventDetails?.location}
                fontSize="24px"
              />
            </div>
            <div style={{ marginTop: "14px" }}>
              <EventDetails width="60%" details={eventDetails?.description} />
            </div>
          </Row>
          <Row
            style={{
              padding: "80px 0px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <p className="section-title" style={{ marginRight: "24px" }}>
                Tickets
              </p>

              <TickitButton
                text="ADD TICKET"
                isLoading={loading}
                disabled={disabled}
                onClick={() => {
                  setAddTicketModal(true);
                }}
              />
            </div>
            {tickets.length == 0 && (
              <EventDetails
                width="100%"
                details="To launch your event you need to add al least 1 Ticket !"
              />
            )}
            {tickets?.map((ticket, index) => (
              <TicketCardPreview
                ticket={ticket}
                handleRemoveTicket={handleRemoveTicket}
                key={index}
              />
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AddTickets;
