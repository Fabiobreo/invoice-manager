import React, { useState, useEffect, useCallback } from "react";
import { User } from "../models/User";

let logoutTimer: NodeJS.Timeout;

type AuthContextObj = {
  token: string | null;
  isLoggedIn: boolean;
  current_user: User | null;
  login: (user: User, expirationTime: string) => void;
  logout: () => void;
};

export const AuthContext = React.createContext<AuthContextObj>({
  token: null,
  isLoggedIn: false,
  current_user: null,
  login: (user: User, expirationTime: string) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime: string) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredData = () => {
  const storedUserId = localStorage.getItem("user_id");
  const storedEmail = localStorage.getItem("email");
  const storedName = localStorage.getItem("name");
  const storedToken = localStorage.getItem("token");
  let storedExpirationDate = localStorage.getItem("expirationTime");
  if (storedExpirationDate == null) {
    storedExpirationDate = "";
  }
  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem("user_id");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    userId: storedUserId ? storedUserId : "",
    email: storedEmail ? storedEmail : "",
    name: storedName ? storedName : "",
    token: storedToken,
    duration: remainingTime,
  };
};

const AuthContextProvider: React.FC = (props) => {
  const storedData = retrieveStoredData();

  let initialUserId = "";
  let initialEmail = "";
  let initialName = "";
  let initialToken = null;
  if (storedData) {
    initialUserId = storedData.userId;
    initialEmail = storedData.email;
    initialName = storedData.name;
    initialToken = storedData.token;
  }

  const [userId, setUserId] = useState<string>(initialUserId);
  const [email, setEmail] = useState<string>(initialEmail);
  const [name, setName] = useState<string>(initialName);
  const [token, setToken] = useState<string | null>(initialToken);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setUserId("");
    setEmail("");
    setName("");
    setToken(null);
    localStorage.removeItem("user_id");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (user: User, expirationTime: string) => {
    setUserId(user.user_id);
    setEmail(user.email);
    setName(user.name);
    setToken(user.token);
    localStorage.setItem("user_id", user.user_id);
    localStorage.setItem("email", user.email);
    localStorage.setItem("name", user.name);
    localStorage.setItem("token", user.token);
    localStorage.setItem("expirationTime", expirationTime);

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (storedData && storedData?.token) {
      logoutTimer = setTimeout(logoutHandler, storedData.duration);
    }
  }, [storedData, logoutHandler]);

  const contextValue: AuthContextObj = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    current_user: {
      user_id: userId,
      email: email,
      name: name,
      token: token ? token : "",
      companyDetails: null
    },
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
