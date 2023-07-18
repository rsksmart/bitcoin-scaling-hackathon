import { toast } from "react-toastify";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Image from "next/image";

import { useCartContext } from "../../cart/cart-context";
import { postEventTicketTypeBatch } from "../../axios/eventTicketType.axios";

import TicketCounter from "../TicketCounter";
import EventDetails from "../EventDetails";
import TickitButton from "../tickitButton";
import Counter from "../Counter";
import EditTicketModal from "../EditTicketModal";

import styles from "./TicketCard.module.scss";

const TicketCard = ({
  ticket,
  ticketFromContract,
  isOwner,
  ended,
  allTickets,
  setRefetchEvent,
  contractAddress,
}) => {
  // States
  const [counter, setCounter] = useState(1);
  const [editTicket, setEditTicket] = useState(false);

  // Functions
  const { addToCart } = useCartContext();

  const handleAddToCart = () => {
    addToCart(ticket, counter);
    setCounter(1);
    toast("Item Added To Cart");
  };
  const handlechangeState = (state) => {
    let ticketsData = {
      eventId: allTickets[0].eventId,
      id: ticket.id,
      isActive: state == "resume" ? true : false,
    };
    postEventTicketTypeBatch(ticketsData).then(() => {
      setRefetchEvent(Date.now());
    });
  };

  return (
    <>
      {editTicket && (
        <EditTicketModal
          setEditTicket={setEditTicket}
          ticketDetails={ticket}
          allTickets={allTickets}
          setRefetchEvent={setRefetchEvent}
          contractAddress={contractAddress}
        />
      )}
      <Col xl={12} style={{ padding: "10px" }}>
        <div className="cardWrapper">
          <div className={styles.cardContainer}>
            <div className={styles.imageDiv}>
              <Image
                width={512}
                height={512}
                className={styles.cardImage}
                alt="card-image"
                src={ticket.image}
              />
              <div className={styles.imageGradient} />
            </div>

            <div className={styles.cardDetails}>
              <div className={styles.cardHeader}>
                <h1 className="section-title">{ticket.name}</h1>

                {isOwner && !ended && (
                  <div>
                    {ticket?.isActive == true && (
                      <Image
                        width={26}
                        height={26}
                        style={{ marginRight: "24px", cursor: "pointer" }}
                        alt="pausesales"
                        src="/images/pausesales.png"
                        onClick={() => {
                          handlechangeState("pause");
                        }}
                      />
                    )}
                    {ticket?.isActive == false && (
                      <Image
                        width={26}
                        height={26}
                        style={{ marginRight: "24px", cursor: "pointer" }}
                        alt="resumesales"
                        src="/images/resumesales.png"
                        onClick={() => {
                          handlechangeState("resume");
                        }}
                      />
                    )}

                    <Image
                      width={22}
                      height={22}
                      alt="edit"
                      src="/images/edit.png"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setEditTicket(true);
                      }}
                    />
                  </div>
                )}
              </div>

              <TicketCounter
                sold={`${
                  Number(ticketFromContract?.currentTokenId) -
                  Number(ticketFromContract?.startTokenId)
                }`}
                total={ticket.supply}
              />
              <EventDetails details={ticket.description} />
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <h1 className={styles.priceCurrency}>ETH </h1>
                <h1 style={{ marginLeft: "5px" }} className={styles.cardPrice}>
                  {ticket.price / 10 ** 18}
                </h1>
              </div>
              {!ended && (
                <Row>
                  <Col className={styles.cardCounter}>
                    {!ticket.isSoldout && (
                      <>
                        <h1 className={styles.cardQuantity}>Enter Quantity</h1>
                        <div style={{ marginLeft: "8px" }}>
                          <Counter
                            counter={counter}
                            setCounter={(value) => setCounter(counter + value)}
                          />
                        </div>
                      </>
                    )}
                  </Col>
                  <Col>
                    {ticket.isSoldout || !ticket.isActive ? (
                      <TickitButton text="sold out" disabled />
                    ) : (
                      <TickitButton
                        text="ADD TO CART"
                        onClick={handleAddToCart}
                      />
                    )}
                  </Col>
                </Row>
              )}
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default TicketCard;
