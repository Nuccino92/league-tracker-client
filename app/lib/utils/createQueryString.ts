// lib/queryString.ts
export function createQueryString(
  params: Record<string, string | undefined>
): string {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      urlParams.set(key, value);
    }
  });

  return urlParams.toString();
}
