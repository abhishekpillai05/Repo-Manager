export async function apiGet<T>(path: string): Promise<T> {
  const baseUrl = '';
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}
