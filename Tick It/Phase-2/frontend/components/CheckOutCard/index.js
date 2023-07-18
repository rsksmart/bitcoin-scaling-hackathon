import React, { useEffect, useState } from "react";
import { useCartContext } from "../../cart/cart-context";
import { getEventTicketType } from "../../axios/eventTicketType.axios";

import TickitButton from "../tickitButton";
import PayUsdModal from "../PayUsdModal";
import PayCrypto from "../PayCryptoModal";

import styles from "./CheckOutCard.module.scss";

const CheckOutCard = ({ cartItemData }) => {
  // Use States
  const [usdmodal, setUsdModal] = useState(false);
  const [cryptomodal, setCryptoModal] = useState(false);
  const [parsedData, setParsedData] = useState(false);

  // Hooks
  const { cartTotal, cartItems } = useCartContext();

  const getEventTicketTypesCount = async (address) => {
    return getEventTicketType(
      JSON.stringify({
        where: { event: { contractAddress: address } },
      })
    ).then((res) => res.data.length);
  };

  const constructEmpyObject = async (cartItemData_) => {
    return await Promise.all(
      [...new Set(cartItemData_.map((item) => item.event.contractAddress))].map(
        async (address) => {
          const eventTicketsLength = await getEventTicketTypesCount(address);
          return {
            address,
            total: 0,
            tickets: new Array(eventTicketsLength).fill(0),
          };
        }
      )
    );
  };

  const parseData = async (cartItemData_) => {
    const constructedObj = await constructEmpyObject(cartItemData_);
    let tmp = {};

    constructedObj.map((item) => {
      tmp[item.address] = { total: item.total, tickets: item.tickets };
    });

    cartItems.map((cartItem) => {
      const itemData = cartItemData_?.filter(
        (i) => i.id == cartItem.ticketId
      )[0];

      const address = itemData?.event.contractAddress;
      if (address) {
        tmp[address].tickets[itemData.ticketTypeId] = cartItem.quantity;

        tmp[address].total =
          tmp[address].total + itemData.price * cartItem.quantity;
      }
    });
    setParsedData(tmp);
  };

  useEffect(() => {
    if (cartItemData) {
      parseData(cartItemData);
    }
  }, [cartItemData]);
  return (
    <>
      {usdmodal && (
        <PayUsdModal
          parsedData={parsedData}
          setUsdModal={setUsdModal}
          cartItemData={cartItemData}
          cartItemsCount={cartItems}
          total={(cartTotal / 10 ** 18).toFixed(6)}
        />
      )}

      {cryptomodal && (
        <PayCrypto
          parsedData={parsedData}
          setCryptoModal={setCryptoModal}
          cartItemData={cartItemData}
          cartItemsCount={cartItems}
          total={(cartTotal / 10 ** 18).toFixed(6)}
        />
      )}

      <div style={{ padding: "10px" }}>
        <div className="cardWrapper">
          <div className={styles.checkOutCard}>
            <p className={styles.title}>Check Out</p>
            <input
              type="text"
              // value={}
              placeholder="Enter Promo Code"
              onChange={(e) => {}}
              className="modalInput"
              style={{ maxWidth: "90%" }}
            />
            <div className={styles.checkOutDetailsDiv}>
              {/* <div className={styles.checkOutDetails}>
                <p>Discount</p>
                <p>-10%</p>
              </div>
              <div className={styles.checkOutDetails}>
                <p>Tax</p>
                <p>+2%</p>
              </div> */}
              <div className={styles.checkOutDetailsTotal}>
                <p>Total</p>
                <p>{(cartTotal / 10 ** 18).toFixed(4)} ETH</p>
              </div>
            </div>
            <TickitButton
              onClick={() => {
                setCryptoModal(true);
              }}
              text="Pay with crypto"
              minWidth="90%"
            />

            <div style={{ margin: "12px 0px", width: "90%" }}>
              <TickitButton
                onClick={() => {
                  setUsdModal(true);
                }}
                text="Pay in USD"
                visa
                style2={true}
                minWidth="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckOutCard;
