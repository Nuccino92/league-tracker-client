function generateNavLinkWithParams(
  url: string,
  params: { [key: string]: any }
): string {
  const queryParams: string[] = [];

  for (const key in params) {
    if (
      params.hasOwnProperty(key) &&
      params[key] !== null &&
      params[key] !== undefined
    ) {
      queryParams.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      );
    }
  }

  const queryString = queryParams.join('&');

  return queryString ? `${url}?${queryString}` : url;
}

export default generateNavLinkWithParams;
