import React from "react";

export const CartContext = React.createContext();

export const useCartContext = () => React.useContext(CartContext);
