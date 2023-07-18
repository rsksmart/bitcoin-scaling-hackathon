import React from "react";

export const AuthContext = React.createContext();

export const useAuthContext = () => useContext(AuthContext);
