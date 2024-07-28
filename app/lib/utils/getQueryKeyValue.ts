function getQueryKeyValue(queryString: string, key: string): string | null {
  // Create a URLSearchParams object from the query string
  const params = new URLSearchParams(queryString);

  // Get the value for the specified key
  const value = params.get(key);

  // If the value exists, return the key-value pair, otherwise return null
  if (value !== null) {
    return `${key}=${value}`;
  } else {
    return null;
  }
}

export default getQueryKeyValue;
