export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export async function registerUser(
  data: RegisterData
): Promise<RegisterResponse> {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao cadastrar");
  }

  return response.json();
}
