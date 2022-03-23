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
  console.log(data);

  if (!response.ok) {
    throw new Error(data ? data : "Could not login with these credentials.");
  }

  return JSON.parse(data);
}
