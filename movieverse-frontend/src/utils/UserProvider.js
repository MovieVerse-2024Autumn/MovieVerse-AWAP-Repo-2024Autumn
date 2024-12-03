import React, { createContext, useState, useContext } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: localStorage.getItem("token") || null,
    firstName: localStorage.getItem("firstName") || null,
    lastName: localStorage.getItem("lastName"),
    profileUrl: localStorage.getItem("profileUrl") || null,
    isAuthenticated: !!localStorage.getItem("token"),
  });

  const login = (token, profileUrl, firstName, lastName) => {
    localStorage.setItem("token", token);
    localStorage.setItem("profileUrl", profileUrl);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    setUser({
      firstName,
      lastName,
      token,
      profileUrl,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profileUrl");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    setUser({
      firstName: null,
      lastName: null,
      token: null,
      profileUrl: null,
      isAuthenticated: false,
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
