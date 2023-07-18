import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

import { validate } from "../axios/auth.axios";

export const AuthProvider = ({ children }) => {
  // States
  const [user, setUser] = useState();

  const logIn = (user) => {
    setUser(user.user);
    localStorage.setItem("token", "Bearer " + user?.token);
  };

  const logOut = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  const restoreUser = async (token) => {
    const response = await validate(token);
    if (response) {
      setUser(response);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      restoreUser(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
