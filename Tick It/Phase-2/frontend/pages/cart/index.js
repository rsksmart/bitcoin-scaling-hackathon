import React, { useEffect } from "react";
import { Container, Col, Row } from "react-bootstrap";

import CartTicket from "../../components/CartTicket";
import CheckOutCard from "../../components/CheckOutCard";
import { useCartContext } from "../../cart/cart-context";
import { getEventTicketType } from "../../axios/eventTicketType.axios";

import styles from "./Cart.module.scss";
const Cart = () => {
  // Use States
  const [cartItemsData, setCartItemsData] = React.useState([]);

  // Hooks
  const { cartItems, setCartTotal } = useCartContext();

  // Functions
  const getTickets = React.useCallback(async () => {
    getEventTicketType(
      JSON.stringify({
        where: cartItems.map((item) => ({
          id: item.ticketId,
        })),
        relations: ["event"],
      })
    ).then((data) => {
      setCartItemsData(data.data);
    });
  }, [cartItems]);

  // Use Effects
  useEffect(() => {
    if (cartItems && cartItems.length) getTickets();
  }, [cartItems]);

  useEffect(() => {
    if (cartItemsData && cartItemsData.length) {
      const total = cartItems.reduce((accumulator, currentValue) => {
        const data = cartItemsData.filter(
          (_item) => _item.id == currentValue.ticketId
        )[0];
        return accumulator + data.price * currentValue.quantity;
      }, 0);
      setCartTotal(total);
    }
  }, [cartItemsData]);

  return (
    <div className={styles.profileWrapper}>
      <Container style={{ paddingTop: "48px", paddingBottom: "48px" }}>
        <Row>
          <Col lg={8}>
            {cartItems?.map((item, index) => (
              <CartTicket
                inCart
                key={index}
                item={item}
                itemData={
                  cartItemsData.filter((_item) => _item.id == item.ticketId)[0]
                }
              />
            ))}
          </Col>
          <Col lg={4}>
            <CheckOutCard cartItemData={cartItemsData} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Cart;
