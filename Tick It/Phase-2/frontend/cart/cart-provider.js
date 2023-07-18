import React from "react";
import { CartContext } from "./cart-context";
import { useEffect } from "react";
import { useRouter } from "next/router";
export const CartProvider = ({ children }) => {
  const router = useRouter();
  const [cartItems, setCartItems] = React.useState([]);
  const [cartTotal, setCartTotal] = React.useState(0);

  const addToCart = (ticket, counter) => {
    const foundItem = cartItems.filter((item) => item.ticketId == ticket.id);
    if (foundItem?.length) {
      let tmp = [...cartItems];
      const index = tmp.indexOf(foundItem[0]);
      tmp[index].quantity += counter;
      setCartItems([...tmp]);
      localStorage.setItem("cart", JSON.stringify([...tmp]));
    } else {
      setCartItems([...cartItems, { ticketId: ticket.id, quantity: counter }]);

      localStorage.setItem(
        "cart",
        JSON.stringify([
          ...cartItems,
          { ticketId: ticket.id, quantity: counter },
        ])
      );
    }
  };

  const deleteFromCart = (itemData) => {
    let tmp = cartItems.filter((item) => item.ticketId != itemData.id);
    setCartItems(tmp);
    localStorage.setItem("cart", JSON.stringify([...tmp]));
  };

  const emptyCart = () => {
    setCartItems([]);
    localStorage.setItem("cart", []);
  };

  useEffect(() => {
    let cart = localStorage.getItem("cart");
    if (cart) setCartItems(JSON.parse(cart));
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        cartTotal,
        setCartTotal,
        addToCart,
        deleteFromCart,
        emptyCart,
      }}
      children={children}
    />
  );
};
