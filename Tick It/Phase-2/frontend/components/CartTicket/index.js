import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Image from "next/image";

import { useCartContext } from "../../cart/cart-context";

import EventDetails from "../EventDetails";
import Counter from "../Counter";
import EventDate from "../EventDate";
import TickitButton from "../tickitButton";
import QrCodeModal from "../qrcode-modal";

import styles from "./CartTicket.module.scss";
import { getEventTicketType } from "../../axios/eventTicketType.axios";

const CartTicket = ({ inCart = false, item, itemData, query = false }) => {
  // Use States
  const [qrCodeModal, setQrCodeModal] = useState(false);
  const [data, setData] = useState()

  // Hooks
  const { deleteFromCart, addToCart } = useCartContext();

  // Functions
  const setCounter = (value) => {
    addToCart(itemData, value);
  };

  useEffect(() => {
    if(query){
      getEventTicketType(JSON.stringify({relations: ["event"],where: {
        event: {contractAddress: itemData.token.contractId}
      }})).then((res) => setData(res.data[0]))
    }
    else setData(itemData)
  }, [itemData])

  return (
    <>
      {qrCodeModal && <QrCodeModal setQrCodeModal={setQrCodeModal} />}
      {data ? (
        <Col xl={12} style={{ padding: "10px" }}>
          <div className="cardWrapper">
            <div className={styles.cardContainer}>
              <div className={styles.imageDiv}>
                <Image
                  width={320}
                  height={320}
                  className={styles.cardImage}
                  alt={data.name}
                  src={data.image}
                />
                <div className={styles.imageGradient} />
              </div>
              <div className={styles.cardDetails}>
                <div className={styles.cardHeader}>
                  <h1 className="section-title">{data.name}</h1>
                  {inCart && (
                    <div className={styles.cardRightLinks}>
                      <Image
                        onClick={() => deleteFromCart(data)}
                        width={14}
                        height={18}
                        style={{ marginLeft: "20px", cursor: "pointer" }}
                        alt="delete"
                        src="/images/pinkDelete.svg"
                      />
                    </div>
                  )}
                </div>
                <Link
                  href={`/event/${data.event?.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <p className={styles.eventName}>{data.event?.name}</p>
                </Link>
                <div style={{ marginBottom: "24px" }}>
                  <EventDate data={data.event?.eventDate} />
                </div>

                <EventDetails details={data.description} />
                {inCart && (
                  <Row className={styles.cardCounter}>
                    <h1 className={styles.cardQuantity}>Enter Quantity</h1>
                    <div style={{ width: "fit-content" }}>
                      <Counter
                        counter={item.quantity}
                        setCounter={setCounter}
                      />
                    </div>
                    <h1 className={styles.cardPrice}>
                      {(
                        Number(data.price / 10 ** 18) * item.quantity
                      ).toFixed(4)}{" "}
                      ETH
                    </h1>
                  </Row>
                )}
                {!inCart && (
                  <Row className={styles.cartTicketButton}>
                    <div style={{ marginTop: "16px", width: "fit-content" }}>
                      <TickitButton
                        style2
                        text="SEND TICKET"
                        minWidth="180px"
                      />
                    </div>
                    <div style={{ marginTop: "16px", width: "fit-content" }}>
                      <TickitButton
                        text="ENTER EVENT"
                        minWidth="180px"
                        onClick={() => {
                          setQrCodeModal(true);
                        }}
                      />
                    </div>
                  </Row>
                )}
              </div>
            </div>
          </div>
        </Col>
      ) : (
        <></>
      )}
    </>
  );
};

export default CartTicket;
