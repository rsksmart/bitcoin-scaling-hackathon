import React from "react";
import { Col } from "react-bootstrap";
import Image from "next/image";

import EventDetails from "../EventDetails";

import styles from "./TicketCardPreview.module.scss";

const TicketCardPreview = ({ ticket, handleRemoveTicket }) => {
  return (
    <>
      <Col xl={12} style={{ padding: "10px" }}>
        <div className="cardWrapper">
          <div className={styles.cardContainer}>
            <div className={styles.imageDiv}>
              <Image
                width={512}
                height={512}
                className={styles.cardImage}
                alt="card-image"
                src={ticket?.image}
              />
              <div className={styles.imageGradient} />
            </div>
            <div className={styles.cardDetails}>
              <div className={styles.cardHeader}>
                <h1 className="section-title">{ticket?.name}</h1>
                <div>
                  <Image
                    width={26}
                    height={26}
                    style={{ marginRight: "24px", cursor: "pointer" }}
                    alt="delete"
                    src="/images/delete.png"
                    onClick={() => handleRemoveTicket(ticket.name)}
                  />
                  {/* <Image
                    width={24}
                    height={24}
                    alt="edit"
                    src="/images/edit.png"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setEditTicket(true);
                    }}
                  /> */}
                </div>
              </div>

              <h4 className={styles.ticketCounter}>Supply: {ticket?.supply}</h4>
              <EventDetails details={ticket?.description} />
              <div
                style={{
                  marginTop: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <h1 className={styles.priceCurrency}>ETH </h1>
                <h1 style={{ marginLeft: "5px" }} className={styles.cardPrice}>
                  {ticket?.price}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
};

export default TicketCardPreview;
