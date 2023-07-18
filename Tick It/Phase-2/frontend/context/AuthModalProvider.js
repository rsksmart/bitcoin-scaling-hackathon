import { createContext, useContext } from "react";
import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/useAuth";
const AuthModalContext = createContext();

export const useAuthModalContext = () => {
  const context = useContext(AuthModalContext);
  return context;
};

export const AuthModalProvider = ({ children }) => {
  const { user } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);

  // const changeModalMode = () =>
  //   // !user ? setModalOpen(true) :
  //   setModalOpen(false);

  useEffect(() => {
    if (user) {
      setModalOpen(false);
    }
  }, [user]);

  return (
    <AuthModalContext.Provider
      value={{
        modalOpen,
        setModalOpen,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};
