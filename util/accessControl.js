export async function checkPatrollerExistence(phoneNumber) {
  const response = await fetch(
    `https://${process.env.EXPO_PUBLIC_API_ENDPOINT}/api/public/check-phone-number`,
    {
      method: "POST",
      body: JSON.stringify({ phoneNumber }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const json = await response.json();

  if (!response.ok) throw new Error(json.error);
}
