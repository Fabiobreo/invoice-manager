import { CompanyDetails } from "../models/CompanyDetails";

const SERVER_DOMAIN = "http://localhost:3139";

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const response = await fetch(`${SERVER_DOMAIN}/register`, {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.text();

  if (!response.ok) {
    throw new Error(data ? data : "Could not create user.");
  }

  try {
    const res = JSON.parse(data);
    if (!res.hasOwnProperty("user_id")) {
      throw new Error();
    }
  } catch (error) {
    throw new Error("Response from the server is not what expected.");
  }

  return null;
};

export const login = async (userData: { email: string; password: string }) => {
  const response = await fetch(`${SERVER_DOMAIN}/login`, {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.text();

  if (!response.ok) {
    throw new Error(data ? data : "Could not login with these credentials.");
  }

  let res;
  try {
    res = JSON.parse(data);
    let check = res.hasOwnProperty("user_id");
    check &= res.hasOwnProperty("email");
    check &= res.hasOwnProperty("name");
    check &= res.hasOwnProperty("token");
    if (!check) {
      throw new Error();
    }
  } catch (error) {
    throw new Error("Response from the server is not what expected.");
  }

  return res;
};

export const getCompanyDetails = async (userToken: string) => {
  const response = await fetch(`${SERVER_DOMAIN}/me`, {
    method: "GET",
    headers: new Headers({
      "x-access-token": userToken,
      "Content-Type": "application/json",
    }),
  });

  const data = await response.text();

  if (!response.ok) {
    throw new Error(data ? data : "Could not fetch company details.");
  }

  let res;
  try {
    res = JSON.parse(data);
    let check = res.hasOwnProperty("id");
    check &= res.hasOwnProperty("name");
    check &= res.hasOwnProperty("email");
    check &= res.hasOwnProperty("password");
    check &= res.hasOwnProperty("companyDetails");
    if (!check) {
      throw new Error();
    }
  } catch (error) {
    throw new Error("Response from the server is not what expected.");
  }

  return res;
};

export const putCompanyDetails = async (userData: {
  token: string;
  companyDetails: CompanyDetails;
}) => {
  const response = await fetch(`${SERVER_DOMAIN}/me/company`, {
    method: "PUT",
    body: JSON.stringify(userData.companyDetails),
    headers: new Headers({
      "x-access-token": userData.token,
      "Content-Type": "application/json",
    }),
  });

  const data = await response.text();

  if (!response.ok) {
    throw new Error(data ? data : "Could not put company details.");
  }

  let res;
  try {
    res = JSON.parse(data);
    let check = res.hasOwnProperty("success");
    check &= res.hasOwnProperty("user");
    if (!check) {
      throw new Error();
    }
  } catch (error) {
    throw new Error("Response from the server is not what expected.");
  }

  return res;
};

export const getClients = async (userToken: string) => {
  const response = await fetch(`${SERVER_DOMAIN}/clients`, {
    method: "GET",
    headers: new Headers({
      "x-access-token": userToken,
      "Content-Type": "application/json",
    }),
  });

  const data = await response.text();

  if (!response.ok) {
    throw new Error(data ? data : "Could not fetch clients list.");
  }

  return JSON.parse(data);
};

export const getClient = async (userData: {
  token: string;
  id: string;
}) => {
  const response = await fetch(`${SERVER_DOMAIN}/clients/${userData.id}`, {
    method: "GET",
    headers: new Headers({
      "x-access-token": userData.token,
      "Content-Type": "application/json",
    })
  });

  const data = await response.text();

  if (!response.ok) {
    throw new Error(data ? data : "Could not fetch client.");
  }

  let res;
  try {
    res = JSON.parse(data);
    let check = res.hasOwnProperty("success");
    check &= res.hasOwnProperty("client");
    if (!check) {
      throw new Error();
    }
  } catch (error) {
    throw new Error("Response from the server is not what expected.");
  }

  return res;
}

export const postClient = async (userData: {
  token: string;
  client: {
    name: string;
    email: string;
    companyDetails: CompanyDetails;
  };
}) => {
  const response = await fetch(`${SERVER_DOMAIN}/clients`, {
    method: "POST",
    body: JSON.stringify(userData.client),
    headers: new Headers({
      "x-access-token": userData.token,
      "Content-Type": "application/json",
    }),
  });

  const data = await response.text();

  if (!response.ok) {
    throw new Error(data ? data : "Could not post new client.");
  }

  let res;
  try {
    res = JSON.parse(data);
    let check = res.hasOwnProperty("success");
    check &= res.hasOwnProperty("client");
    if (!check) {
      throw new Error();
    }
  } catch (error) {
    throw new Error("Response from the server is not what expected.");
  }

  return res;
};

export const putClient = async (userData: {
  token: string;
  client: {
    id: string
    name: string;
    email: string;
    companyDetails: CompanyDetails;
  };
}) => {
  const response = await fetch(`${SERVER_DOMAIN}/clients`, {
    method: "PUT",
    body: JSON.stringify(userData.client),
    headers: new Headers({
      "x-access-token": userData.token,
      "Content-Type": "application/json",
    }),
  });

  const data = await response.text();

  if (!response.ok) {
    throw new Error(data ? data : "Could not update client.");
  }

  let res;
  try {
    res = JSON.parse(data);
    let check = res.hasOwnProperty("success");
    check &= res.hasOwnProperty("client");
    if (!check) {
      throw new Error();
    }
  } catch (error) {
    throw new Error("Response from the server is not what expected.");
  }

  return res;
};