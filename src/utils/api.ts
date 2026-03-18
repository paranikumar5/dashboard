
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  maxRetries: number = 1,
  initialDelay: number = 0
): Promise<Response> {
  return fetch(url, options);
}
