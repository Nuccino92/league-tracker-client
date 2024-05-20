export async function checkIfSlugIsUnique({
  token,
  slug,
  context,
}: {
  token: string;
  slug: string;
  context: 'league' | 'organization';
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_KEEPR_API_URL}/slug/check-unique?slug=${slug}&context=${context}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  return data as { unique: boolean };
}
