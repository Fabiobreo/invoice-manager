import React, { useState, useEffect, useCallback } from "react";
import { CompanyDetails } from "../models/CompanyDetails";
import { User } from "../models/User";

let logoutTimer: NodeJS.Timeout;

type AuthContextObj = {
  token: string | null;
  isLoggedIn: boolean;
  current_user: User | null;
  login: (user: User, expirationTime: string) => void;
  logout: () => void;
  setCompanyDetails: (companyDetails: CompanyDetails) => void;
};

export const AuthContext = React.createContext<AuthContextObj>({
  token: null,
  isLoggedIn: false,
  current_user: null,
  login: () => {},
  logout: () => {},
  setCompanyDetails: () => {}
});

const calculateRemainingTime = (expirationTime: string) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const clearLocalStorage = () => {
  localStorage.removeItem("user_id");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  localStorage.removeItem("token");
  localStorage.removeItem("expirationTime");
  localStorage.removeItem("companyName");
  localStorage.removeItem("companyAddress");
  localStorage.removeItem("companyVat");
  localStorage.removeItem("companyReg");
}

const retrieveStoredData = () => {
  const storedUserId = localStorage.getItem("user_id");
  const storedEmail = localStorage.getItem("email");
  const storedName = localStorage.getItem("name");
  const storedToken = localStorage.getItem("token");
  
  const storedCompanyName = localStorage.getItem("companyName");
  const storedCompanyAddress =localStorage.getItem("companyAddress");
  const storedCompanyVat =localStorage.getItem("companyVat");
  const storedCompanyReg =localStorage.getItem("companyReg");
  let storedExpirationDate = localStorage.getItem("expirationTime");
  if (storedExpirationDate === null) {
    storedExpirationDate = "";
  }
  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    clearLocalStorage();
    return null;
  }

  return {
    userId: storedUserId ? storedUserId : "",
    email: storedEmail ? storedEmail : "",
    name: storedName ? storedName : "",
    companyName: storedCompanyName ? storedCompanyName : "",
    companyAddress: storedCompanyAddress ? storedCompanyAddress : "",
    companyVat: storedCompanyVat ? storedCompanyVat : "",
    companyReg: storedCompanyReg ? storedCompanyReg : "",
    token: storedToken,
    duration: remainingTime,
  };
};

const AuthContextProvider: React.FC = (props) => {
  const storedData = retrieveStoredData();

  let initialUserId = "";
  let initialEmail = "";
  let initialName = "";
  let initialCompanyDetails = null;
  let initialToken = null;
  if (storedData) {
    initialUserId = storedData.userId;
    initialEmail = storedData.email;
    initialName = storedData.name;
    initialToken = storedData.token;
    if (storedData.companyName !== "")
    {
      initialCompanyDetails = {
        name: storedData.companyName,
        address: storedData.companyAddress,
        vatNumber: storedData.companyVat,
        regNumber: storedData.companyReg
      }
    }
  }

  const [userId, setUserId] = useState<string>(initialUserId);
  const [email, setEmail] = useState<string>(initialEmail);
  const [name, setName] = useState<string>(initialName);
  const [token, setToken] = useState<string | null>(initialToken);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(initialCompanyDetails);

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setUserId("");
    setEmail("");
    setName("");
    setToken(null);
    setCompanyDetails(null);
    clearLocalStorage();

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = useCallback((user: User, expirationTime: string) => {
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
  }, [logoutHandler]);

  const setCompanyDetailsHandler = useCallback((companyDetails: CompanyDetails) => {
    setCompanyDetails(companyDetails);
    localStorage.setItem("companyName", companyDetails.name);
    localStorage.setItem("companyAddress", companyDetails.address);
    localStorage.setItem("companyVat", companyDetails.vatNumber);
    localStorage.setItem("companyReg", companyDetails.regNumber);
  }, []);

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
      companyDetails: companyDetails
    },
    login: loginHandler,
    logout: logoutHandler,
    setCompanyDetails: setCompanyDetailsHandler
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
