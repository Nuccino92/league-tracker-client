export async function authRequest(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}/auth`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
}

export async function loginRequest({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}/login`,
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response;
}

export async function logoutRequest(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}/logout`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
}

export async function registerRequest({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}/register`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    }
  );

  return response;
}
