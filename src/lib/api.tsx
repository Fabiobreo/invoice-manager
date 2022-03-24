const SERVER_DOMAIN = "http://localhost:3139";

export async function register(userData: any) {
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

  return null;
}

export async function login(userData: any) {
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

  return JSON.parse(data);
}

export async function getCompanyDetails(userToken: string) {
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

  return JSON.parse(data);
}

export async function putCompanyDetails(userData: any) {
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

  return JSON.parse(data);
}
